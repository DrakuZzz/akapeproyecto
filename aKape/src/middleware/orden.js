document.addEventListener("DOMContentLoaded", () => {
    mostrarDetalleOrden();
  });
  
  async function mostrarDetalleOrden() {
    try {
      const res = await fetch("/mostrar/carrito");
      const data = await res.json();
      const { products, total, envio, totalenvio, vacio } = data;
  
      const ultimos3 = sessionStorage.getItem("ultimos3Digitos") || "---";
  
      const container = document.getElementById("carrito");
      container.classList.add("objetos");
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
  
        // Sección de resumen y botones
        const resumenDiv = document.createElement("div");
        resumenDiv.classList.add("resumen");
  
        resumenDiv.innerHTML = `
          <p class="total">Total de productos: $${total}</p>
          <p class="total">Envío: $${envio}</p>
          <p class="total"><strong>Total a pagar: $${totalenvio}</strong></p>
          <p class="total">Tarjeta terminación: ***${ultimos3}</p>
          <button id="confirmar" class="pago">Confirmar Orden</button>
          <button id="cancelar" class="pago">Cancelar</button>
        `;
  
        container.appendChild(resumenDiv);
  
        document.getElementById("confirmar").addEventListener("click", () => {
          window.location.href = "/orden/confirmacion";
        });
  
        document.getElementById("cancelar").addEventListener("click", () => {
          window.location.href = "/cart";
        });
      } else {
        container.innerHTML = `
          <div class="productos">
            <h1 class="page">No hay productos en el carrito</h1>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error al cargar el detalle de la orden:", error);
    }
  }
  

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
                window.location.href = "/modif";
              });
            });
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
            });
        }
  
        function cargaruserside() {
          fetch("/usersidebar")
            .then((res) => res.text())
            .then((sidebarHTML) => {
              document.getElementById("sidebar").innerHTML = sidebarHTML;
  
              const icono = data.Admin === 1
                ? `<i class="fa-solid fa-user-secret"></i>`
                : `<i class="fa-solid fa-circle-user"></i>`;
  
              const contain = document.getElementById("user");
              contain.innerHTML = `
                ${icono}
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
        // Usuario no logueado
        fetch("/sidebar")
          .then((res) => res.text())
          .then((sidebarHTML) => {
            document.getElementById("sidebar").innerHTML = sidebarHTML;
            MostrarCategorias();
          });
  
        fetch("/header")
          .then((res) => res.text())
          .then((headerHTML) => {
            document.getElementById("header").innerHTML = headerHTML;
            document.getElementById("cart").addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/cart";
            });
          });
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
  