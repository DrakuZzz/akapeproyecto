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

const idorden = decodeURIComponent(window.location.hash.substring(1));

async function mostrarDetalleOrden() {
  const idorden = decodeURIComponent(window.location.hash.substring(1));
  const container = document.getElementById("carrito");
  container.innerHTML = "";

  const ordenRes = await fetch("/orden/detalles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idorden }),
  });

  const orden = await ordenRes.json();

  let metodo = "";

  if (orden.Tipopago === "Transferencia"){
    metodo = `<p class="total">UMétodo de pago: Transferencia</p>`
  }
  else {
    metodo =  `<p class="total">Ultimos 3 dígitos = ${orden.ultimos3}</p>`
  }

  // Mostrar resumen
  const resumen = document.createElement("div");
  resumen.classList.add("resumen");

  resumen.innerHTML = `
    <p class="total">Gracias por tu compra, ${orden.Nombre} ${orden.Paterno} ${orden.Materno}</p>
    <p class="total">Orden #${orden.Idorden}</p>
    <p class="total">Total pagado: $${orden.Total}</p>
    ${metodo}
    <p class="total">Dirección de entrega: ${orden.Direccion}, ${orden.Colonia}, ${orden.Ciudad}, ${orden.Estado}</p>
    <div class="botones">
    <button id="volver" class="pago">Volver al carrito</button>
    <button id="detalles" class="pago">Ver mis pedidos</button>
    </div>
  `;

  container.appendChild(resumen);

  document.getElementById("volver").addEventListener("click", () => {
    window.location.href = "/cart";
  });

  document.getElementById("detalles").addEventListener("click", () => {
    window.location.href = "/user#orders";
  });
}

