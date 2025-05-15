function generarHTMLPedido(datos) {
    const productosHTML = datos.productos.map(p =>
      `<li>${p.nombre} (x${p.cantidad}) - $${p.precio}</li>`
    ).join("");
  
    return `
      <h2>Confirmación de pedido #${datos.orden}</h2>
      <p>Gracias por tu compra, ${datos.nombreCliente}.</p>
      <p><strong>Total:</strong> $${datos.total}</p>
      <p><strong>Productos:</strong></p>
      <ul>${productosHTML}</ul>
      <p>Te contactaremos cuando tu pedido esté en camino.</p>
    `;
  }
  
  export { generarHTMLPedido };
  