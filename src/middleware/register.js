document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const Email = document.getElementById("Email").value;
  const Nombre = document.getElementById("Nombre").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  if (password === password2) {
    try {
      const response = await fetch("../registro/insercion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, password, Nombre }),
      });

      const data = await response.json();
      if (data.success) {
        await Swal.fire({
          title: "Registrado correctamente",
          icon: "success",
          draggable: true
        });
        window.location.href = data.redirect;
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Este usuario ya existe",
        });
        window.location.href = data.redirect;

      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar la solicitud");
    }
  } else {
    alert("Las contraseñas no coinciden");
  }
});
