// Verificar sesión
fetch("/session-user")
  .then((res) => res.json())
  .then((data) => {
    if (data.loggedIn) {
      if (data.Admin === 1) {
        window.location = "/";
      } else if (data.Admin === 3) {
        window.location = "/pedidos";
      }
      else {
        fetch("/header")
          .then((res) => res.text())
          .then((headerHTML) => {
            document.getElementById("header").innerHTML = headerHTML;
            cargaruserside();
            mostrarTotal()
          });
      }
      function cargaruserside() {
        // Cuando hay usuario
        fetch("/usersidebar")
          .then((res) => res.text())
          .then((sidebarHTML) => {
            document.getElementById("sidebar").innerHTML = sidebarHTML;
            const contain = document.getElementById("user");
            contain.innerHTML = `
          <i class="fa-solid fa-circle-user"></i>
          <h1 class="h1">${data.Nombre}</h1>`;
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

document.addEventListener("DOMContentLoaded", async () => {
  mostrarProductos();
  mostrarTotal()
});

async function mostrarProductos() {
  try {
    const res = await fetch("/mostrar/carrito");
    const data = await res.json();
    const products = data.products;
    const total = data.total;
    const envio = data.envio;
    const totalenvio = data.totalenvio;
    const vacío = data.vacio;

    const conta = document.getElementById("carrito");
    conta.classList.add("objetos");
    conta.innerHTML = "";

    if (vacío === 1) {
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("productos");

        productDiv.innerHTML = `
        <div class="derechita">
              <a href="/product#${product.nombre}"><img src="${product.imagen}" class="imagen" alt="Imagen del producto"></a>
              <p class="page">${product.nombre}</p>
              <p>$${product.precio}</p>
        </div>
        <div class="izquierdita">
            <div class="cantidad">
                <icono class="fa-solid fa-minus" data-id="${product.Idproducto}"></icono>
                <p>${product.cantidad}</p>
                <icono class="fa-solid fa-plus" data-id="${product.Idproducto}"></icono>
            </div>
                <p>$${product.subtotal}</p>
              <icono class="fa-solid fa-trash" " data-id="${product.Idproducto}"></icono>
        </div>
        <hr><hr>
        `;
        conta.appendChild(productDiv);
      });
    } else if (vacío === 0) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("productos");

      productDiv.innerHTML = `
      <h1 class="page">Añade productos a tu carrito</h1>
      `;
      conta.appendChild(productDiv);
    }

    const pie = document.getElementById("pie");
    pie.innerHTML = ""; // Limpiar el contenedor antes de agregar los productos

    const datitos = document.createElement("div");
    datitos.classList.add("pie");

    datitos.innerHTML = `
      <button id="limpiar" class="fa-solid fa-trash"></button>
      <p class="total" >Total de productos: $${total}</p>
      <p class="total">Envío: $${envio}</p>
      <p class="total">Total a pagar: $${totalenvio}</p>
      <input type="submit" id="pagar" value="Continuar Compra" class="pago">
      `;
    pie.appendChild(datitos);

    document.getElementById("pagar").addEventListener("click", (e) => {
      e.preventDefault();
      verificar()

    });

    async function verificar() {
      const res = await fetch("/verificar");
      const data = await res.json();

      if (data.success) {
        if (data.redirect) {
          window.location.href = data.redirect; // Redirige a la pagina de productos
        }
      } else {
        alert(data.message); // Muestra el mensaje de "Credenciales incorrectas"
        if (data.redirect) {
          window.location.href = data.redirect; // Recrga la pagina
        }

      }
    }


    document.getElementById("limpiar").addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const valor = "limpiar";
        const res = await fetch("/limpiar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valor })
        });

        // Verificar si la respuesta es exitosa
        if (res.ok) {
          mostrarProductos()
          mostrarTotal()
        } else {
          console.error("Error al limpiar el carrito");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    });

    document.querySelectorAll(".fa-minus").forEach((boton) => {
      boton.addEventListener("click", async (e) => {
        e.preventDefault();
        const objeto = e.target.getAttribute('data-id');
        const valor = "Disminuir";
        actualizarcant(objeto, valor);
      });
    });

    document.querySelectorAll(".fa-plus").forEach((boton) => {
      boton.addEventListener("click", async (e) => {
        e.preventDefault();
        const objeto = e.target.getAttribute('data-id');
        const valor = "Aumentar";
        actualizarcant(objeto, valor);
      });
    });

    document.querySelectorAll(".fa-trash").forEach((boton) => {
      boton.addEventListener("click", async (e) => {
        e.preventDefault();
        const objeto = e.target.getAttribute('data-id');
        const valor = "Eliminar";
        actualizarcant(objeto, valor);
      });
    });



  } catch (error) {
    console.error("Error al obtener productos del carrito:", error);
  }
}

async function actualizarcant(objeto, valor) {
  const res = await fetch("/limpiar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valor, objeto })
  });

  if (res.ok) {
    mostrarProductos()
    mostrarTotal()
  } else {
    console.error("Error al limpiar el carrito");
  }
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
