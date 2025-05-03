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
        // Aquí podrías hacer el fetch POST al backend si deseas enviar la actualización
    });
});

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