document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("carrito");
    container.classList.add("objetos");
    container.innerHTML = "";
  
    try {
      const res = await fetch("/mostrar/carrito");
      const data = await res.json();
  
      const { products, total, envio, totalenvio, vacio } = data;
      const ultimos3 = sessionStorage.getItem("ultimos3Digitos") || "---";
  
      if (vacio !== 1 || products.length === 0) {
        container.innerHTML = `<h1 class="page">No hay productos en el carrito</h1>`;
        return;
      }
  
      // Obtener el idclient desde la sesión
      const sessionRes = await fetch("/session-user");
      const sessionData = await sessionRes.json();
  
      if (!sessionData.loggedIn) {
        window.location.href = "/login";
        return;
      }
  
      const ordenRes = await fetch("/orden/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productos: products,
          total,
          envio,
          totalenvio
        }),
      });
      
  
      const ordenData = await ordenRes.json();
  
      if (!ordenData.success) {
        container.innerHTML = `<p class="page">Error al procesar la orden.</p>`;
        return;
      }
  
      // Mostrar productos como antes
      products.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("productos");
  
        div.innerHTML = `
          <div class="derechita">
            <img src="${product.imagen}" class="imagen" alt="Imagen del producto">
            <p class="page">${product.nombre}</p>
            <p>Precio: $${product.precio}</p>
          </div>
          <div class="izquierdita">
            <p>Cantidad: ${product.cantidad}</p>
            <p>Subtotal: $${product.subtotal}</p>
          </div>
        `;
  
        container.appendChild(div);
      });
  
      const resumen = document.createElement("div");
      resumen.classList.add("resumen");
  
      resumen.innerHTML = `
        <p class="total">Total productos: $${total}</p>
        <p class="total">Envío: $${envio}</p>
        <p class="total"><strong>Total a pagar: $${totalenvio}</strong></p>
        <p class="total">Tarjeta terminación: ***${ultimos3}</p>
        <button id="volver" class="pago">Volver al carrito</button>
      `;
  
      container.appendChild(resumen);
  
      document.getElementById("volver").addEventListener("click", () => {
        window.location.href = "/cart";
      });
  
    } catch (error) {
      console.error("Error cargando detalle de orden:", error);
      container.innerHTML = `<p class="page">Error al mostrar la orden</p>`;
    }
  });
  