document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const Email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('../login/datos', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email, password })
        });

        // Recibe los valores que regresa el logincontroller.js
        const data = await response.json();

        //Si data.success es true, muestra un mensaje de bienvenida y redirige a la pagina de productos
        //Si data.success es false, muestra un mensaje de credenciales incorrectas y recarga la pagina
        if (data.success) {
            await Swal.fire({
                title: "¡Bienvenido!",
                icon: "success",
                confirmButtonText: "Continuar"
            });

            window.location.href = data.redirect; // Redirige a la pagina de productos

        } else {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Usuario o contraseña incorrecta",
                confirmButtonText: "Continuar"
            });
            window.location.href = data.redirect; // Recrga la pagina
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar la solicitud');
    }
});

