let isAdmin = false;

fetch("/session-user")
  .then((res) => res.json())
  .then((data) => {
    if (data.loggedIn) {
      if (data.Admin === 1) {
        isAdmin = data.Admin === 1;
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
            document.getElementById("cart").addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/cart";
            });

            cargaruserside(); // esta parte ya existe
            mostrarTotal();   // <-- AÑADE ESTA LÍNEA AQUÍ
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

            MostrarCategorias().then(() => {
              // En el front, tenemos variables que tienen el mismo nombre de categorías, esta parte nos obtiene el valor que contenga cada una en su values
              const categorias = document.querySelectorAll(".categorias");
              categorias.forEach((categoria) => {
                categoria.addEventListener("click", () => {
                  //Obtenemos el valor de la categoría seleccionada
                  const valor = categoria.getAttribute("values");
                  window.location.hash = valor; // Hacemos que en el buscador se añada #VALOR
                  cargarCategoria(valor);
                });
              });

              const hash = decodeURIComponent(
                window.location.hash.replace("#", "")
              );
              if (hash) {
                cargarCategoria(hash);
              }
            });
          });
      }
    } else {
      // Cuando no hay usuario
      fetch("/sidebar")
        .then((res) => res.text())
        .then((sidebarHTML) => {
          document.getElementById("sidebar").innerHTML = sidebarHTML;

          MostrarCategorias().then(() => {
            const categorias = document.querySelectorAll(".categorias");
            categorias.forEach((categoria) => {
              categoria.addEventListener("click", () => {
                const valor = categoria.getAttribute("values");
                window.location.hash = valor;
                cargarCategoria(valor);
              });
            });

            const hash = decodeURIComponent(
              window.location.hash.replace("#", "")
            );
            if (hash) {
              cargarCategoria(hash);
            }
          });
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

// Cargar el sidebar y asignar eventos

// Mostrar productos en el contenedor

async function MostrarCategorias() {
  try {
    const res = await fetch("/categorias");
    const categorias = await res.json();
    const container = document.getElementById("category-container");
    container.innerHTML = ""; // Limpia si es necesario

    categorias.forEach((cat) => {
      const link = document.createElement("a");
      link.href = `#${encodeURIComponent(cat.categoria)}`;

      const h1 = document.createElement("h1");
      h1.classList.add("categorias");
      h1.setAttribute("values", cat.categoria);
      h1.textContent = cat.categoria;

      link.appendChild(h1);
      container.appendChild(link);
    });

    return true; // Indica que terminó correctamente
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return false;
  }
}

function mostrarProductos(productos) {
  console.log("Producto:" + productos.Estado)

    const container = document.getElementById("product-container");
    container.innerHTML = "";

    productos.forEach((producto) => {
      if (producto.Estado === 1 && isAdmin === false) {

      const productDiv = document.createElement("div");
      productDiv.classList.add("products");

      productDiv.innerHTML = `
      <div class="upper">
        <a href="/product#${producto.nombre}">
          <img class="showimage" src="${producto.imagen}" alt="${producto.nombre}">
        </a>
      </div>
      <div class="lower">
        <h2 class="name">${producto.nombre}</h2>
        <p class="price">Unidad: ${producto.unidad}</p>
        <p class="price">Precio: $${Number(producto.precio).toFixed(2)}</p>
        <button class="button" id="${producto.Idproducto}">Añadir al carrito</button>
      </div>
    `;

      container.appendChild(productDiv);
    }
    else if (isAdmin === true && producto.Estado === 0 || producto.Estado === 1) {

      const productDiv = document.createElement("div");
      productDiv.classList.add("products");

      productDiv.innerHTML = `
      <div class="upper">
        <a href="/product#${producto.nombre}">
          <img class="showimage" src="${producto.imagen}" alt="${producto.nombre}">
        </a>
      </div>
      <div class="lower">
        <h2 class="name">${producto.nombre}</h2>
        <p class="price">Unidad: ${producto.unidad}</p>
        <p class="price">Precio: $${Number(producto.precio).toFixed(2)}</p>
        <button class="button" id="${producto.Idproducto}">Modificar producto</button>
      </div>
    `;

      container.appendChild(productDiv);
    }
  });
  }


// Cargar una categoría específica
async function cargarCategoria(valor) {
  const container = document.getElementById("product-container");

  // Limpiamos estilos anteriores
  document.querySelectorAll(".categorias").forEach((cat) => {
    cat.style.backgroundColor = "";
    cat.style.color = "";
  });

  const seleccionado = document.querySelector(`[values='${valor}']`);
  if (seleccionado) {
    seleccionado.style.backgroundColor = "#F3CAA2";
    seleccionado.style.color = "#1D1B1E";
  }

  try {
    const res = await fetch("/productos/all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor }),
    });

    const productos = await res.json();
    mostrarProductos(productos);
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = "<p>Error al cargar productos por categoría.</p>";
  }
}

// Al cargar el DOM mostramos todos los productos
document.addEventListener("DOMContentLoaded", async () => {
  valor = "";
  const res = await fetch("/productos/all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valor }),
  });
  const productos = await res.json();
  mostrarProductos(productos);
  mostrarTotal();
});



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
