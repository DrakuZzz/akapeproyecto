const productContainer = document.getElementById('product-container');

productContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains('button')) {
    e.preventDefault();

    if (e.target.textContent === 'Añadir al carrito') {
      const textoOriginal = e.target.textContent;

      const producto = e.target.getAttribute("id");
      try {
        const response = await fetch("../agregar/carrito", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ producto }),
        });

        const data = await response.json();
        if (data.success) {
          e.target.textContent = 'Añadido ✔';
          e.target.classList.add('exito');

          setTimeout(() => {
            e.target.textContent = textoOriginal;
            e.target.classList.remove('exito');
          }, 600);

        } else {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Inicia sesión para añadir productos al carrito",
            confirmButtonText: "Continuar"
          });
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al procesar la solicitud");
      }
      mostrarTotal();
    }

    else if (e.target.textContent === 'Modificar producto') {
      const producto = e.target.getAttribute("id");

      const res = await fetch("/obtenerprodcuto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ producto }),
      });

      const datos = await res.json();

      window.location.href = `/product#${datos.nombre}`;
    }
  }
});

const productContainer2 = document.getElementById('product-container');

productContainer2.addEventListener("click", async (e) => {
  if (e.target.classList.contains('sino2')) {
    e.preventDefault();

    if (e.target.textContent === 'Agregar al carrito') {
      const productoId = e.target.getAttribute("id");
      const textoOriginal = e.target.textContent;

      try {
        const response = await fetch("../agregar/carrito", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ producto: productoId }),
        });

        const data = await response.json();
        if (data.success) {
          e.target.textContent = 'Añadido ✔';
          e.target.classList.add('exito');

          setTimeout(() => {
            e.target.textContent = textoOriginal;
            e.target.classList.remove('exito');
          }, 600);
        }
         else {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message || "Inicia sesión para añadir productos al carrito",
            confirmButtonText: "Continuar"
          });
        }
      } catch (error) {
        console.error("Error:", error);
        await Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: "Hubo un error al procesar la solicitud",
          confirmButtonText: "OK"
        });
      }

      mostrarTotal();
    }
  }
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
