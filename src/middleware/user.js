// Verificar sesión
fetch("/session-user")
  .then((res) => res.json())
  .then((data) => {
    if (data.loggedIn) {
      if (data.Admin === 1) {
        fetch("/adminheader")
          .then((res) => res.text())
          .then((headerHTML) => {
            document.getElementById("header").innerHTML = headerHTML;
            cargaruserside(data);
            document.getElementById("add").addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/modif";
            });
            document.getElementById("adduser").addEventListener("click", (e) => {
              e.preventDefault();
              {
                window.location.href = "/adduser";
              }
            });
          });
        buscar();
      } else if (data.Admin === 3) {
        window.location = "/pedidos";
      } else {
        fetch("/header")
          .then((res) => res.text())
          .then((headerHTML) => {
            document.getElementById("header").innerHTML = headerHTML;
            cargaruserside(data);
            document.getElementById("cart").addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/cart";
            });
            mostrarTotal();
            buscar();
          });
      }
    } else {
      window.location.href = "/"
    }
  });

function cargaruserside(data) {
  fetch("/usersidebar")
    .then((res) => res.text())
    .then((sidebarHTML) => {
      document.getElementById("sidebar").innerHTML = sidebarHTML;
      const icono =
        data.Admin === 1
          ? `<i class="fa-solid fa-user-secret"></i>`
          : `<i class="fa-solid fa-circle-user"></i>`;

      const contain = document.getElementById("user");
      contain.innerHTML = `${icono}<h1 class="h1">${data.Nombre}</h1>`;
      contain.classList.add("user");

      const out = document.getElementById("logout");
      if (out) {
        out.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            const res = await fetch("/logout", { method: "POST" });
            if (res.ok) {
              window.location.href = "/";
            } else {
              console.error("Error al cerrar sesión");
            }
          } catch (error) {
            console.error("Error al cerrar sesión:", error);
          }
        });
      }

      if (window.location.hash === "#info" || window.location.hash === "#orders") {
        const nosotros = document.getElementById("user");
        if (nosotros) {
          nosotros.classList.add("activo");
        }
      }

      MostrarCategorias();
    });
}

async function buscar() {
  const inputTexto = document.getElementById("Buscar");

  inputTexto.addEventListener("click", async (e) => {
    // Limpiar estilos anteriores
    const valor = document.getElementById('Texto').value.trim();
    if (valor) {
      // Redirige al index y pasa el término por hash
      window.location.href = "/#" + encodeURIComponent(valor);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarInfo();

});

document.getElementById("infoped").addEventListener("click", (e) => {
  e.preventDefault();
  if (infoped.value === "Historial de pedidos") {
    window.location.hash = "#orders";
  } else {
    window.location.hash = "#info";
  }
  cargarInfo();
});

function cargarInfo() {
  if (window.location.hash === "#info") {
    infoped.value = "Historial de pedidos";
    fetch("/info")
      .then((res) => res.text())
      .then((contentHTML) => {
        document.getElementById("content").innerHTML = contentHTML;
        mostrardatos();
      });
  } else if (window.location.hash === "#orders") {
    infoped.value = "Información de usuarios";
    fetch("/orders")
      .then((res) => res.text())
      .then((contentHTML) => {
        document.getElementById("content").innerHTML = contentHTML;
        console.log("Contenido de orders cargado, llamando a mostrarOrdenes()");
        mostrarOrdenes();
      });
  }

}

async function MostrarCategorias() {
  try {
    const res = await fetch("/categorias");
    const categorias = await res.json();
    const container = document.getElementById("category-container");

    categorias.forEach((cat) => {
      const link = document.createElement("a");
      link.href = `../#${encodeURIComponent(cat.categoria)}`;

      const h1 = document.createElement("h1");
      h1.classList.add("categorias");
      h1.setAttribute("values", cat.categoria);
      h1.textContent = cat.categoria;

      link.appendChild(h1);
      container.appendChild(link);
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
}

async function mostrarOrdenes() {
  try {
    const res = await fetch("/userinfo");

    if (!res.ok) {
      const datosError = await res.json();
      console.error("Error:", datosError.message);
      return;
    }

    const datos = await res.json();
    console.log("Datos recibidos:", datos);

    const ordenesContainer = document.getElementById("ordenes-container");
    if (!ordenesContainer) return;

    ordenesContainer.innerHTML = "";

    let Ordenestad = "";

    if (datos.Ordenes && datos.Ordenes.length > 0) {
      datos.Ordenes.forEach((orden) => {
        let Ordenestad = "";
        if (orden.Ordenestado == 0) {
          Ordenestad = "Pendiente";
        } else if (orden.Ordenestado == 1) {
          Ordenestad = "Enviado";
        } else if (orden.Ordenestado == 2) {
          Ordenestad = "Entregado";
        }

        const div = document.createElement("div");
        div.classList.add("ordenes");
        div.innerHTML = `<div class="arriba">
          <p class="label">Número de orden #${orden.Idorden}</p>
          <p class="label">Estado: ${Ordenestad}</p>
          </div>
          <div class="abajo">
          <p class="label">Fecha de orden: ${orden.Fechaorden.split("T")[0]}</p>
          <p class="label">Número de productos: ${orden.Numero}</p>
          <p class="label">Total pagado: $${parseFloat(orden.Total).toFixed(2)}</p>
          <input type="submit" class="details" value="Ver detalles" id="${orden.Idorden}">
          </div>
        `;
        ordenesContainer.appendChild(div);
      });
    } else {
      ordenesContainer.innerHTML = `<p>No hay órdenes registradas.</p>`;
    }

  } catch (error) {
    console.error("Error al mostrar órdenes:", error);
  }
  document.getElementById("ordenes-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("details")) {
      e.preventDefault();
      const Idorden = e.target.id;
      orden(Idorden);
    }
  });

}

async function mostrardatos() {
  const res = await fetch("/userinfo");
  const datos = await res.json();

  const all = document.getElementById("info");

  all.innerHTML = `
  <h1 class="page">Datos personales</h1>
  <div class="info">
    <figcaption class="label">Primer Nombre<br><input type="text" id="FirstName" class='info-input' value="${datos.Nombre}" autocomplete="off"></figcaption>
    <figcaption class="label">Paterno<br><input type="text" id="Paterno" class='info-input' value="${datos.Paterno}" autocomplete="off"></figcaption>
    <figcaption class="label">Materno<br><input type="text" id="Materno" class='info-input' value="${datos.Materno}" autocomplete="off"></figcaption>
    <figcaption class="label">Teléfono<br><input type="text" id="Telefono" class='info-input' value="${datos.Telefono}" autocomplete="off"></figcaption>
    <figcaption class="label">Estado<br><input type="text" id="Estado" class='info-input' value="${datos.Estado}" autocomplete="off"></figcaption>
    <figcaption class="label">Ciudad<br><input type="text" id="Ciudad" class='info-input' value="${datos.Ciudad}" autocomplete="off"></figcaption>
    <figcaption class="label">Colonia<br><input type="text" id="Colonia" class='info-input' value="${datos.Colonia}" autocomplete="off"></figcaption>
    <figcaption class="label">Dirección (Tus calles)<br><input type="text" id="Direccion" class='info-input' value="${datos.Direccion}" autocomplete="off"></figcaption>
    <figcaption class="label">Código Postal<br><input type="text" id="Cp" class='info-input' value="${datos.Cp}" autocomplete="off"></figcaption>
  </div>
  <div class="info2">
    <figcaption class="label">Referencias<br><textarea id="Referencias" class='info-input2' autocomplete="off">${datos.Descripcion}</textarea></figcaption>
    <figcaption class="label"><br><br><input type="submit" id="Actualizar" value='Actualizar' class="Actualizar"></figcaption>
  </div>
  <h1 class="page">Actualizar datos de inicio</h1>
  <div class="info">
    <figcaption class="label">Contraseña Anterior<br><input type="password" id="Oldpass" class='info-input' placeholder="Contraseña" autocomplete="off"></figcaption>
    <figcaption class="label">Contraseña Nueva<br><input type="password" id="Password" class='info-input' placeholder="Contraseña" autocomplete="off"></figcaption>
    <figcaption class="label">Repetir Contraseña<br><input type="password" id="Password2" class='info-input' placeholder="Repetir Contraseña" autocomplete="off"></figcaption>
  </div>
  <div class="derecha">
    <input type="submit" id="Actualizar2" value='Actualizar' class="Actualizar">
  </div>
`;

  document.getElementById("Actualizar").addEventListener("click", async (e) => {
    e.preventDefault();
    const Actualizar = 1;
    const Nombre = document.getElementById("FirstName").value;
    const Paterno = document.getElementById("Paterno").value;
    const Materno = document.getElementById("Materno").value;
    const Telefono = document.getElementById("Telefono").value;
    const Estado = document.getElementById("Estado").value;
    const Ciudad = document.getElementById("Ciudad").value;
    const Colonia = document.getElementById("Colonia").value;
    const Direccion = document.getElementById("Direccion").value;
    const Cp = document.getElementById("Cp").value;
    const Descripcion = document.getElementById("Referencias").value;

    try {
      const response = await fetch("../actualizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre,
          Paterno,
          Materno,
          Telefono,
          Estado,
          Ciudad,
          Colonia,
          Direccion,
          Cp,
          Descripcion,
          Actualizar,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Datos actualizados",
          showConfirmButton: false,
          timer: 1500
        });
        mostrardatos(); // Recarga los datos si es necesario
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo anda mal!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar la solicitud");
    }
  });

  document
    .getElementById("Actualizar2")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const Actualizar = 2;
      const Oldpass = document.getElementById("Oldpass").value;
      const Password = document.getElementById("Password").value;
      const Password2 = document.getElementById("Password2").value;

      try {
        if (Password === Password2) {
          const response = await fetch("../actualizar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Actualizar,
              Password,
              Oldpass,
            }),
          });
          const data = await response.json();

          if (data.success) {
            await Swal.fire({
              position: "top",
              icon: "success",
              title: "Datos actualizados",
              showConfirmButton: false,
              timer: 1500
            });
            mostrardatos();
          } else {
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo anda mal!",
            });
          }
        } else {
          alert("Los datos no coinciden");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al procesar la solicitud");
      }
    });

}


async function mostrarTotal() {
  try {
    const res = await fetch("/mostrar/carrito");
    const data = await res.json();

    const totalenvio = data.totalenvio;

    // Verifica si el total es correcto
    if (totalenvio === undefined || totalenvio === null) {
      console.error("Total no definido");
      return;
    }

    const iconoTexto = document.querySelector(".icono-texto");

    if (!iconoTexto) {
      console.error("No se encontró el contenedor .icono-texto");
      return;
    }

    const existente = iconoTexto.querySelector(".carrito");
    if (existente) {
      existente.remove();
    }

    const figcaption = document.createElement("figcaption");
    figcaption.classList.add("carrito");
    figcaption.textContent = `$${totalenvio.toFixed(2)}`;

    iconoTexto.appendChild(figcaption);
  } catch (error) {
    console.error("Error al mostrar el total del carrito:", error);
  }
}


async function orden(Idorden) {
  const orden = Idorden;

  const res = await fetch("/ordenes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orden }),
  });

  const detalle = await res.json();

  console.log("Cliente:", detalle.Nombre, detalle.Paterno);
  console.log("Detalles de la orden:", detalle.Idorden, detalle.Fechaorden, detalle.Total);

  detalle.productos.forEach(producto => {
    console.log("Producto:", producto.Nombre);
    console.log("Cantidad:", producto.Cantidad);
    console.log("Precio:", producto.Precio);
    console.log("Subtotal:", producto.Subtotal);
  });

  const overlay = document.createElement("div");
  overlay.classList.add("overlay"); // usa tu clase, o agrega estilos directamente

  const modal = document.createElement("div");
  modal.classList.add("detalleorden");
  modal.id = "modal-detalle";

  let coment1 = ""
  let coment2 = ""

  if (detalle.ComentarioEnviado == null) {
    coment1 = "No hay comentarios"
  }
  else {
    coment1 = detalle.ComentarioEnviado;
  }

  if (detalle.ComentarioEntregado == null) {
    coment2 = "No hay comentarios"
  } else {
    coment2 = detalle.ComentarioEntregado;
  }

  modal.innerHTML = `
  <div class="bloque">
    <h1 class="page">Orden con número #${detalle.Idorden}</h1>
    <h2 class="page">A nombre de ${detalle.Nombre} ${detalle.Paterno}</h2>
  </div>

  <div class="bloque">
    <h3 class="ordendetalle">Detalles de la orden:</h3>
    <div class="ordenar">
      <p class="ordendetalle"><strong>Estado:</strong> ${detalle.Ordenestado === 0 ? 'Pendiente' : detalle.Ordenestado === 1 ? 'Enviado' : detalle.Ordenestado === 2 ? 'Entregado' : 'Desconocido'}</p>
      <p class="ordendetalle"><strong>Ciudad:</strong> ${detalle.Ciudad}</p>
      <p class="ordendetalle"><strong>Colonia:</strong> ${detalle.Colonia}</p>
      <p class="ordendetalle"><strong>Dirección:</strong> ${detalle.Direccion}</p>
      <p class="ordendetalle"><strong>Fecha de Orden:</strong> ${detalle.Fechaorden || ''}</p>
      <p class="ordendetalle"><strong>Fecha de Envío:</strong> ${detalle.Fechaenvio || ''}</p>
      <p class="ordendetalle"><strong>Tipo de Pago:</strong> ${detalle.Tipopago}</p>
      ${detalle.Tipopago !== 'Transferencia' ? `<p class="ordendetalle"><strong>Últimos 3 dígitos:</strong> ${detalle.ultimos}</p>` : ''}
      <p class="ordendetalle"><strong>Total:</strong> $${detalle.Total}</p>
      <p class="ordendetalle"><strong>Fecha de Entrega:</strong> ${detalle.Fechaentrega || ''}</p>
    </div>
  </div>
  <div class="bloque">
    <h3 class="ordendetalle">Productos:</h3>
    <ul>
      ${detalle.productos.map(producto => `
        <li class="ordendetalle">
          <strong>${producto.Nombre}</strong><br>
          Cantidad: ${producto.Cantidad}<br>
          Precio: $${producto.Precio}<br>
          Subtotal: $${producto.Subtotal}<br>
        </li>
      `).join('')}
    </ul>
  </div>
  <div class="bloque">
    <h3 class="ordendetalle">Comentarios de Envío:</h3>
    <p class="ordendetalle">Comentario de envío: ${coment1 || "No hay comentario"}</p>
    <p class="ordendetalle">Comentario de entrega: ${coment2 || "No hay comentario"}</p>
  </div>

  <center><button id="cerrar-modal" class="details">Cerrar</button></center>
`;


  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Cerrar modal con botón
  document.getElementById("cerrar-modal").addEventListener("click", () => {
    modal.remove();
    overlay.remove();
  });

  // También cerrar al hacer clic en el fondo
  overlay.addEventListener("click", () => {
    modal.remove();
    overlay.remove();
  });
}
