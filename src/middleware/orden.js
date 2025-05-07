// Verificar sesión
fetch("/session-user")
  .then((res) => res.json())
  .then((data) => {
    if (data.loggedIn) {
      if (data.Admin === 1) {
        window.location = "/";
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
              window.location.href = "/cart";
            });
            buscar();
          });
      }

      function cargaruserside() {
        fetch("/usersidebar")
          .then((res) => res.text())
          .then((sidebarHTML) => {
            document.getElementById("sidebar").innerHTML = sidebarHTML;

            const contain = document.getElementById("user");
            contain.innerHTML = `
                <i class="fa-solid fa-circle-user"></i>
                <h1 class="h1">${data.Nombre}</h1>
              `;
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
            MostrarCategorias();
          });
      }
    } else {
      window.location.href = "/"
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

document.addEventListener("DOMContentLoaded", () => {
  mostrarDetalleOrden();
});

async function mostrarDetalleOrden() {
  try {
    const res = await fetch("/mostrar/carrito");
    const data = await res.json();
    const { products, total, envio, totalenvio, vacio } = data;

    const container = document.getElementById("carrito");
    container.classList.add("objetos2");
    container.innerHTML = "";

    if (vacio === 1 && products.length > 0) {
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("productos");

        productDiv.innerHTML = `
            <div class="derechita">
              <img src="${product.imagen}" class="imagen" alt="Imagen del producto">
              <p class="page">${product.nombre}</p>
              <p>Precio: $${product.precio}</p>
            </div>
            <div class="izquierdita">
              <p>Cantidad: ${product.cantidad}</p>
              <p>Subtotal: $${product.subtotal}</p>
            </div>
          `;

        container.appendChild(productDiv);
      });

      const totales = document.getElementById("total");
      totales.classList.add("objetos3");
      totales.innerHTML = "";

      // Sección de resumen y botones
      const resumenDiv = document.createElement("div");
      resumenDiv.classList.add("resumen");

      resumenDiv.innerHTML = `
      <div class="pagos" id="pago">

      <div class="metodos" id="Tarjeta de crédito">
                    <i class="fa-solid fa-credit-card"></i>
                    <h1 class="price">Crédito</h1>
                </div>
                <div class="metodos" id="Tarjeta de débito">
                    <i class="fa-regular fa-credit-card"></i>
                    <h1 class="price">Débito</h1>
                </div>
                <div class="metodos" id="Transferencia">
                    <i class="fa-solid fa-money-bill-transfer"></i>
                    <h1 class="price">Transferencia</h1>
                </div>
      </div>
                <div class="datos" id="datos">

            </div>
            <div class="down">
          <p class="total">Total de productos: $${total}</p>
          <p class="total">Envío: $${envio}</p>
          <p class="total">Total a pagar: $${totalenvio}</p>
          <button id="confirmar" class="crear">Confirmar Orden</button>
          <button id="cancelar" class="cancelar">Cancelar</button>
          </div>
        `;

      totales.appendChild(resumenDiv);

      document.getElementById("confirmar").addEventListener("click", async () => {
        const pago = document.getElementById("datos");

        let ultimos3 = null;

        if (metodoSeleccionado === "Tarjeta de crédito" || metodoSeleccionado === "Tarjeta de débito") {
          const nombre = document.getElementById("Nombre").value.trim();
          const numero = document.getElementById("NumeroTarjeta").value.trim();
          const mes = document.getElementById("Mes").value;
          const año = document.getElementById("Año").value;
          const cvv = document.getElementById("CVV").value.trim();

          if (!nombre || !numero || mes === "Mes" || año === "Año" || !cvv) {
            await Swal.fire("Favor de rellenar todos los campos de la tarjeta");
            return;
          }

          if (!/^\d{16}$/.test(numero)) {
            await Swal.fire("El número de tarjeta debe ser de 16 digitos");
            return;
          }

          if (!/^\d{3}$/.test(cvv)) {
            await Swal.fire("El CVV debe tener 3 dígitos!");
            return;
          }

          const fechaActual = new Date();
          const fechaSeleccionada = new Date(`${año}-${mes}-01`);
          if (fechaSeleccionada < fechaActual) {
            alert("La tarjeta está vencida.");
            return;
          }

          ultimos3 = numero.slice(-3);

        } else if (metodoSeleccionado === "Transferencia") {
          const nombre = document.getElementById("Nombre").value.trim();
          const archivo = document.getElementById("comprobante").files[0];

          if (!nombre || !archivo) {
            await Swal.fire("Favor de relllenar todos los campos!");
            return;
          }
        } else {
          await Swal.fire("Selecciona un método de pago");
          return;
        }


        // Si todo está bien, procesar la orden
        const ordenRes = await fetch("/orden/crear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productos: products,
            total,
            envio,
            totalenvio,
            ultimos3,
            metodo_pago: metodoSeleccionado
          }),
        });


        const ordenData = await ordenRes.json();

        const idorden = ordenData.idorden;

        if (!ordenData.success) {
          container.innerHTML = `<p class="page">Error al procesar la orden.</p>`;
          return;
        }

        await Swal.fire({
          title: "Orden confirmada!",
          icon: "success",
          draggable: true
        });
        window.location.href = `/orden/confirmacion#${idorden}`; // o donde corresponda
      });


      document.getElementById("cancelar").addEventListener("click", () => {
        window.location.href = "/cart";
      });
    }
  } catch (error) {
    console.error("Error al cargar el detalle de la orden:", error);
  }

  const metodos = document.querySelectorAll(".metodos");

  metodos.forEach((metodo) => {
    metodo.addEventListener("click", () => {
      metodos.forEach((m) => m.classList.remove("metodo-activo"));

      metodo.classList.add("metodo-activo");

      const trajeta = metodo.getAttribute("id");
      metod(trajeta);
    });
  });

}

let metodoSeleccionado = null;

function metod(trajeta) {
  metodoSeleccionado = trajeta;


  if (trajeta === "Tarjeta de crédito" || trajeta === "Tarjeta de débito") {
    const pago = document.getElementById("datos");
    pago.classList.add("datos");
    pago.innerHTML = "";

    pago.innerHTML = `
                    <div class="cositas">
                    <label for="Nombre">Nombre completo</label>
                    <input type='text' id='Nombre' autocomplete="off" class="input" required>
                  </div>

                  <div class="cositas">
                    <label for="NumeroTarjeta">Número de tarjeta</label>
                    <input type='text' id='NumeroTarjeta' autocomplete="off" class="input" required>
                  </div>

                  <div class="cositas Expirar">
                    <label for="Expiración">Expiración</label>
                    <div class="expiracion-selects">
                      <select id="Mes" required>
                        <option disabled selected>Mes</option>
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                      </select>

                      <select id="Año" required>
                        <option disabled selected>Año</option>
                      </select>
                    </div>
                  </div>

                  <div class="cositas">
                    <label for="CVV">CVV</label>
                    <input type='text' id='CVV' autocomplete="off" class="cvv" required>
                  </div>`;

    const selectyear = document.getElementById("Año");
    const yearActual = new Date().getFullYear();
    for (let i = yearActual; i <= yearActual + 8; i++) {
      let opcion = document.createElement('option');
      opcion.value = i;
      opcion.innerText = i;
      selectyear.appendChild(opcion);
    }
  }
  else if (trajeta === "Transferencia") {
    const pago = document.getElementById("datos");
    pago.classList.add("datos");
    pago.innerHTML = "";

    pago.innerHTML = `
                  <div>
                    <h1 class="page">Información de pago</h1>
                      <h1 class="page">Número de transferencia: 722969010112614861</h1>
                  </div>
                  <div>
                      <label for="Nombre">Nombre completo</label>
                      <input type='text' id='Nombre' autocomplete="off" class="input" required><br><br>
                      <label for="comprobante">Subir comprobante de transferencia en PDF</label><br>
                      <input type="file" id="comprobante" accept=".pdf">
                  </div>
          `;

  }

}