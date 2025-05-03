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
          });
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
          mostrarTotal();
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

            if (window.location.hash === "") {
              const nosotros = document.getElementById("Nosotros");
              if (nosotros) {
                nosotros.style.backgroundColor = "#F3CAA2";
                nosotros.style.color = "#1D1B1E";
              }
            }
            MostrarCategorias();
          });
      }
    } else {
      // Cuando no hay usuario
      fetch("/sidebar")
        .then((res) => res.text())
        .then((sidebarHTML) => {
          document.getElementById("sidebar").innerHTML = sidebarHTML;
          MostrarCategorias();
          if (window.location.hash === "") {
            const nosotros = document.getElementById("Nosotros");
            if (nosotros) {
              nosotros.style.backgroundColor = "#F3CAA2";
              nosotros.style.color = "#1D1B1E";
            }
          }
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

async function mostrarTotal() {
  try {
    const res = await fetch("/mostrar/carrito");
    const data = await res.json();  // Asegúrate de extraer los datos del JSON de la respuesta

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
