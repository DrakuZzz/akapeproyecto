function iniciarBuscador() {


    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    async function buscarProductos(valor) {
        const res = await fetch("/productos/all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor }),
        });

        const data = await res.json();
        const resultadosDiv = document.getElementById('resultado');
        resultadosDiv.classList.add('resultados');
        resultadosDiv.innerHTML = '';

        if (data.length === 0) {
            resultadosDiv.innerHTML = '<p class="infop">No se encontraron productos relacionados</p>';
            return;
        }

        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('item');
            div.style.cursor = 'pointer'; // para que parezca clickeable

            div.innerHTML = `
                <img src="${item.imagen}" class="ima" alt="NO IMAGEN">
                <p>${item.nombre}</p>
                <p>${item.precio}</p>
            `;

            div.addEventListener('click', () => {
                const pagina = `/product#${item.nombre}`;
                if (window.location.pathname === "/product") {
                    window.location.hash = `#${item.nombre}`;
                    window.location.reload();
                } else {
                    window.location.href = pagina;
                }
            });

            resultadosDiv.appendChild(div);
        });

    }

    const input = document.getElementById('Texto');
    const resultadosDiv = document.getElementById('resultado');
    let isFocused = false;

    input.addEventListener('focus', () => {
        isFocused = true;

        const valor = input.value.trim();
        if (valor.length > 0) {
            buscarProductos(valor);
        }
    });


    input.addEventListener('blur', () => {
        // Esperar un poco por si se hace clic en un resultado
        setTimeout(() => {
            isFocused = false;
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('resultados');
        }, 150);
    });

    input.addEventListener('input', debounce(function () {
        if (!isFocused) return;

        const valor = this.value.trim();

        if (valor.length > 0) {
            buscarProductos(valor);
        } else {
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('resultados');
        }
    }, 200));

    // Oculta resultados si el clic es fuera del input y del contenedor de resultados
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !resultadosDiv.contains(e.target)) {
            resultadosDiv.innerHTML = '';
            resultadosDiv.classList.remove('resultados');
        }
    });
}// Espera a que el DOM esté cargado y el header esté inyectado
window.addEventListener('DOMContentLoaded', () => {
    // Espera un poco más si el header se carga con JS
    setTimeout(iniciarBuscador, 300); // Ajusta el tiempo si es necesario
});