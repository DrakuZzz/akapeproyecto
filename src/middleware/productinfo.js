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
            cargaruserside();
            document.getElementById("add").addEventListener("click", (e) => {
              e.preventDefault();
              {
                window.location.href = "/modif";
              }
            });
            document.getElementById("adduser").addEventListener("click", (e) => {
              e.preventDefault();
              {
                window.location.href = "/adduser";
              }
            });
            buscar();
          });
      } else if (data.Admin === 3) {
        window.location = "/pedidos";
      } else {
        fetch("/header")
          .then((res) => res.text())
          .then((headerHTML) => {
            document.getElementById("header").innerHTML = headerHTML;
            cargaruserside();
            document.getElementById("cart").addEventListener("click", (e) => {
              e.preventDefault();
              {
                window.location.href = "/cart";
              }
            });
            MostrarProducto();
            buscar();
          });
      }
      function cargaruserside() {
        // Cuando hay usuario
        fetch("/usersidebar")
          .then((res) => res.text())
          .then((sidebarHTML) => {
            document.getElementById("sidebar").innerHTML = sidebarHTML;
            const icono =
              data.Admin === 1
                ? `<i class="fa-solid fa-user-secret"></i>`
                : `<i class="fa-solid fa-circle-user"></i>`;

            const contain = document.getElementById("user");
            contain.innerHTML = `
              ${icono}
              <h1 class="h1">${data.Nombre}</h1>
            `;
            contain.classList.add("user");

            // Una vez cargado el sidebar, le damos el evento de salir al logout
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
            MostrarCategorias();
          });
      }
      document.body.style.visibility = "visible";
    } else {
      // Cuando no hay usuario
      fetch("/sidebar")
        .then((res) => res.text())
        .then((sidebarHTML) => {
          document.getElementById("sidebar").innerHTML = sidebarHTML;
          MostrarCategorias();
          MostrarProducto(producto);
        });

      fetch("/header")
        .then((res) => res.text())
        .then((headerHTML) => {
          document.getElementById("header").innerHTML = headerHTML;
          document.getElementById("cart").addEventListener("click", (e) => {
            e.preventDefault();
            {
              window.location.href = "/cart";
            }
          });
          buscar();
        });
      document.body.style.visibility = "visible";
    }
  });


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


const producto = decodeURIComponent(window.location.hash.substring(1));

document.addEventListener("DOMContentLoaded", async () => {
  if (producto) {
    const res = await fetch("/session-user");
    const data = await res.json();

    if (data.loggedIn && data.Admin === 1) {
      MostrarProductoModificable(producto);
    } else {
      MostrarProducto(producto);
      mostrarTotal();
    }
  }
});

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

async function MostrarProductoModificable(producto) {
  const valor = producto;

  const res = await fetch("/obtenerprodcuto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valor }),
  });

  const datos = await res.json();

  if (!datos || !datos.nombre) {
    console.error("Producto no encontrado.");
    return;
  }

  // Contenedor donde se insertará el formulario
  const contenedor = document.getElementById("product-container") || document.body;

  let bot = "";

  if (datos.estado == 1) {
    bot = "Deshabilitar";
  } else if (datos.estado == 0) {
    bot = "Habilitar";
  }


  contenedor.innerHTML = `
    <div class="miniheader">
      <h2 class="page">Página para modificar producto</h2>
      <input type="submit" id="Cancelar" value="Cancelar" class="sino" onclick="location.reload()">
      <input type="submit" id="Aceptar" value="Aceptar" class="sino">
      <input type="submit" id="${bot}" value="${bot}" class="sino" style="background-color:red; color:white;">
    </div>
    <div class="cate">
      <div class="Imagenes">
        <center>
          <input class="Invisible" type="file" id="foto" accept="image/*">
          <label for="foto" class="price">Imagen (Fondo Transparente/Blanco 350 x 273px)</label><br>
          <img src="${datos.imagen || '/images/productos/NADA.png'}" class="mostrar" id="image">
        </center>
      </div>
      <div class="alldatos">
        <div class="categoria">
          <h3 class="name">Nombre:</h3><input type="text" id="nombre" class='datos' autocomplete="off" value="${datos.nombre}">
        </div>
        <div class="categoria">
          <h3 class="name">Precio:</h3><input type="text" id="precio" class='datos' placeholder="0.00" autocomplete="off" value="${datos.precio}">
        </div>
        <div class="categoria">
          <h3 class="name">Categoria:</h3>
          <select id="categoria" class="datos">
            <option value="" disabled hidden>Seleccionar</option>
            <option value="Café en grano" ${datos.categoria === 'Café en grano' ? 'selected' : ''}>Café en grano</option>
            <option value="Bebida fría" ${datos.categoria === 'Bebida fría' ? 'selected' : ''}>Bebida fría</option>
            <option value="Bebida caliente" ${datos.categoria === 'Bebida caliente' ? 'selected' : ''}>Bebida caliente</option>
            <option value="Postres" ${datos.categoria === 'Postres' ? 'selected' : ''}>Postres</option>
          </select>
        </div>
        <div class="categoria">
          <h3 class="name">Unidad:</h3><input type="text" id="unidad" class='datos' autocomplete="off" value="${datos.unidad}">
        </div>
        <div class="categoria">
          <h3 class="name">Stock:</h3><input type="text" id="cantidad" class='datos' autocomplete="off" value="${datos.stock}">
        </div>
      </div>
    </div>
    <div class="description">
      <center>
        <div class="si">
          <h3 class="name">Descripción del producto (100 palabras máximo)</h3>
          <textarea id="descripcion" class='descr' rows="4" cols="100" placeholder="Descripción del producto">${datos.descripcion}</textarea>
        </div>
      </center>
    </div>
  `;

  // Vista previa de imagen cuando se selecciona nuevo archivo
  document.getElementById("foto").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("image").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById(bot).addEventListener("click", async () => {
    const accion = bot === "Deshabilitar" ? "deshabilitar" : "habilitar";
    const nuevoEstado = bot === "Deshabilitar" ? 0 : 1;

    const result = await Swal.fire({
      title: `¿Estás seguro de que deseas ${accion} este producto?`,
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      denyButtonText: "No guardar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/deleteprod", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idproducto: datos.idproducto, Estado: nuevoEstado }),
        });

        const data = await response.json();

        if (data.success) {
          await Swal.fire({
            position: "top",
            icon: "success",
            title: "Producto deshabilitado",
            showConfirmButton: false,
            timer: 1500
          });
          location.reload();
        } else {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "¡Algo salió mal!"
          });
        }
      } catch (error) {
        console.error("Error al cambiar el estado del producto:", error);
      }
    } else if (result.isDenied) {
      Swal.fire("Los cambios no se guardaron", "", "info");
    }
  });


  document.getElementById("Aceptar").addEventListener("click", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const categoria = document.getElementById('categoria').value;
    const unidad = document.getElementById('unidad').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const fileInput = document.getElementById('foto');
    const file = fileInput.files[0];

    if (!nombre || !precio || !categoria || !unidad || !cantidad || !descripcion) {
      await Swal.fire("Rellena todos los campos!");
      return;
    }

    let nombreImagen = datos.imagen;

    if (file) {
      const formData = new FormData();
      formData.append('imagen', file);

      try {
        const uploadResponse = await fetch('/subir-imagen', {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al subir la imagen!",
          });
          return;
        }

        nombreImagen = uploadData.nombreArchivo;
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        return;
      }
    }

    const imagen = file ? "images/productos/" + nombreImagen : nombreImagen;

    try {
      const response = await fetch("../addprod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio,
          categoria,
          unidad,
          imagen,
          descripcion,
          cantidad
        }),
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Producto actualizado!",
          icon: "success",
          draggable: true
        });
        location.reload(); // Recargar la página después de actualizar
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al actualizar producto",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  });
}


async function MostrarProducto(producto) {
  const valor = producto;
  const res = await fetch("../obtenerprodcuto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valor }),
  });

  const datos = await res.json();

  if (!datos || !datos.nombre) {
    console.error("Producto no encontrado.");
    return;
  }

  const pors = document.getElementById("product-container");

  pors.innerHTML = `
    <div class="infoproduc">
      <div id="izquierdica">
        <div id="imagenp" class="izquierdica">
          <img class="imagenp" src="${datos.imagen}">
          <p class="price">Precio: $${datos.precio}</p>
          <p class="price">Unidad: ${datos.unidad}</p>
          <p class="price">Categoria: ${datos.categoria}</p>
          <p class="price">Stock: ${datos.stock}</p>
        </div>
      </div>
      <div id="derechita" class="derechita">
        <h1 class="page">${datos.nombre}</h1>
        <div class="stars" id="product-rating">
          <!-- Las estrellas se llenarán dinámicamente -->
        </div>
        <h2 class="infop">${datos.descripcion}</h2>
        <button class="sino2" id="${datos.idproducto}">Agregar al carrito</button>
      </div>
    </div>

    <div class="Reseñas">
      <div class="Comentarios">
        <div class="stars" id="user-stars">
          ${[1, 2, 3, 4, 5].map(i => `<i id="star-${i}" data-value="${i}" class="fa-regular fa-star"></i>`).join('')}
        </div>
        <textarea id="descripcion" class='descr' rows="4" cols="100" placeholder="Comentar"></textarea>
        <input type="submit" id="coment" value="Enviar comentario" class="sino2" style="margin-left: auto;">
      </div>
      <div class="rese" id="rese">
      </div>
    </div>
  `;

  renderProductRating(datos.calificacion || 0);

  setupUserStars();

  // Enviar comentario
  document.getElementById("coment").addEventListener("click", async () => {
    const comentario = document.getElementById("descripcion").value.trim();
    if (!comentario || selectedRating === 0) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes dejar un comentario y dar una calificación",
      });
      return;
    }

    // Enviar comentario
    const response = await fetch("/calificacion/producto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idproducto: datos.idproducto,
        comentario,
        calificacion: selectedRating,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      await Swal.fire("Inicia sesión para comentar!");
    }


    document.getElementById("descripcion").value = "";
    resetUserStars();
    await cargarComentarios(datos.idproducto);

    // 🔄 Obtener la nueva calificación promedio y actualizar estrellas
    const resCalif = await fetch("/obtenerprodcuto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ valor: producto }),
    });
    const nuevoDatos = await resCalif.json();
    renderProductRating(nuevoDatos.calificacion || 0);
  });


  // Cargar comentarios existentes

  await cargarComentarios(datos.idproducto);

}

let selectedRating = 0;

function setupUserStars() {
  const stars = document.querySelectorAll("#user-stars i");

  stars.forEach(star => {
    star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
    star.addEventListener("mouseout", () => resetHoverStars());
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.value);
      fixSelectedStars(selectedRating);
    });
  });
}

function highlightStars(rating) {
  const stars = document.querySelectorAll("#user-stars i");
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= rating) {
      star.classList.remove("fa-regular");
      star.classList.add("fa-solid");
    } else {
      star.classList.remove("fa-solid");
      star.classList.add("fa-regular");
    }
  });
}

function resetHoverStars() {
  fixSelectedStars(selectedRating);
}

function fixSelectedStars(rating) {
  const stars = document.querySelectorAll("#user-stars i");
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= rating) {
      star.classList.remove("fa-regular");
      star.classList.add("fa-solid");
    } else {
      star.classList.remove("fa-solid");
      star.classList.add("fa-regular");
    }
  });
}

function resetUserStars() {
  selectedRating = 0;
  const stars = document.querySelectorAll("#user-stars i");
  stars.forEach(star => {
    star.classList.remove("fa-solid");
    star.classList.add("fa-regular");
  });
}

async function cargarComentarios(idproducto) {
  const res = await fetch("/cargar/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idproducto }),
  });

  const comentarios = await res.json();
  const reseContainer = document.getElementById("rese");

  reseContainer.innerHTML = comentarios.map(com => `
    <div class="comentario">
    <div class="division">
      <p class="puc">${com.First_Name} ${com.Paterno}</p>
      <div class="stars">
        ${renderStars(com.estrellas)}
      </div>
      <p class="infop">${com.comentario}</p>
      </div>
    </div>
  `).join('');

}

function renderStars(calificacion) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(calificacion)) {
      html += '<i class="fa-solid fa-star"></i>';
    } else if (i - calificacion <= 0.5) {
      html += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      html += '<i class="fa-regular fa-star"></i>';
    }
  }
  return html;
}

function renderProductRating(calificacion) {
  const container = document.getElementById("product-rating");
  container.innerHTML = renderStars(calificacion);
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
