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
                        document.getElementById("adduser").addEventListener("click", (e) => {
                            e.preventDefault();
                            {
                                window.location.href = "/adduser";
                            }
                        });
                        document.getElementById("add").addEventListener("click", (e) => {
                            e.preventDefault();
                            {
                                window.location.href = "/modif";
                            }
                        });
                        cargaruserside();
                        document.body.style.visibility = "visible";
                        añadirUsuario();
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

function añadirUsuario() {
    const btn = document.getElementById("addUserBtn");
    if (!btn) return;

    btn.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.getElementById("Email").value.trim();
        const nombre = document.getElementById("name").value.trim();
        const paterno = document.getElementById("Paterno").value.trim();
        const materno = document.getElementById("Materno").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const rango = document.getElementById("rango").value;
        const password = document.getElementById("password").value;

        if (!email || !nombre || !paterno || !telefono || !rango || !password) {
            await Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos obligatorios.",
            });
            return;
        }

        try {
            const res = await fetch("/addusuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    nombre,
                    paterno,
                    materno,
                    telefono,
                    rango,
                    password,
                }),
            });

            const data = await res.json();


            if (data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Usuario añadido",
                    text: "El nuevo usuario ha sido registrado correctamente.",
                });
                location.reload();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "No se pudo añadir el usuario.",
                });
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error inesperado al enviar los datos.",
            });
        }
    });
}