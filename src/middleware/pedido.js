document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-actualizacion");


    async function cargarPedidos() {
        try {
            const res = await fetch("/pedetalle");
            const pedidos = await res.json();

            const select = document.getElementById("pedido");
            select.innerHTML = '<option disabled selected>-- Selecciona un pedido --</option>';

            pedidos.forEach(pedido => {
                const option = document.createElement("option");
                option.value = pedido.Idorden;
                const estadoTexto = pedido.Ordenestado === 0 ? "Pendiente" : "Enviado";
                option.textContent = `#${pedido.Idorden} - Estado: ${estadoTexto}`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        }
    }

    cargarPedidos();

    document.getElementById("enviar-actualizacion").addEventListener("click", () => {
        pedido()
    });

    document.getElementById("obtenerdatos").addEventListener("click", () => {
        cargardatos()
    });


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
});

async function cargardatos() {
    const orden = document.getElementById("pedido").value;

    const response = await fetch("../pedatos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ orden }),
    });

    const data = await response.json();
    console.log(data)
    if (data.success) {
        const c = data.cliente;
        const container = document.getElementById('datos');
        container.classList.add("datos");

        container.innerHTML = `
            <p>Nombre del cliente: ${c.First_name} ${c.Paterno}</p>
            <p>Número de teléfono: ${c.Telefono}</p>
            <p>Estado: ${c.Estado}</p>
            <p><Ciudad: ${c.Ciudad}</p>
            <p><Colonia: ${c.Colonia}</p>
            <p>Dirección: ${c.Direccion}</p>
            <p>CP: ${c.Cp}</p>
            <p>Referencias: ${c.Descripcion}</p>
        `;
    }
    else {
        alert(data.message);
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    }
}

async function pedido() {
    const orden = document.getElementById("pedido").value;
    const ordenestado = document.getElementById("estado").value;
    const comentario = document.getElementById("comentario").value;

    const response = await fetch("../pedupda", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ orden, ordenestado, comentario }),
    });

    const data = await response.json();
    if (data.success) {
        alert(data.message);
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    } else {
        alert(data.message);
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    }
}