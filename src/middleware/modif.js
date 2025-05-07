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
            document.body.style.visibility = "visible";
            añadir();
            buscar();
          });
      }
      else {
        window.location.href = "/";
      }
      function cargaruserside() {
        // Cuando hay usuario
        fetch("/usersidebar")
          .then((res) => res.text())
          .then((sidebarHTML) => {
            document.getElementById("sidebar").innerHTML = sidebarHTML;
            const contain = document.getElementById("user");
            contain.innerHTML = `
          <i class="fa-solid fa-user-secret"></i>
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
    }
    else {
      window.location.href = "/";
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

const defaultFile = "/images/productos/NADA.png";

const file = document.getElementById("foto");
const img = document.getElementById("image");

file.addEventListener("change", (e) => {
  if (e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  } else {
    img.src = defaultFile;
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

async function añadir() {
  document.getElementById('Aceptar').addEventListener("click", async (e) => {
    e.preventDefault();

    // 1. Verificar que todos los campos estén llenos antes de subir imagen
    const nombre = document.getElementById('nombre').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const categoria = document.getElementById('categoria').value;
    const unidad = document.getElementById('unidad').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const fileInput = document.getElementById('foto');
    const file = fileInput.files[0];

    if (!nombre || !precio || !categoria || !unidad || !cantidad || !descripcion || !file) {
      await Swal.fire("Rellena todos los campos y selecciona una imagen!");
      return;
    }

    // 2. Subir imagen
    const formData = new FormData();
    formData.append('imagen', file);

    let nombreImagen = '';

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

    const imagen = "images/productos/" + nombreImagen;

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
          title: "Producto añadido!",
          icon: "success",
          draggable: true
        });
        location.reload(); // Recargar la página después de actualizar
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al añadir producto",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  });
}
