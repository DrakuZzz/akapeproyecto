function generarHTMLEnvio(datos) {
    return `
      <h2>Confirmación el envío de tu pedido con número de orden #${datos.orden}</h2>
      <p>A nombre de ${datos.nombreCliente}.</p>
      <p>Con número de teléfono: ${datos.clienteTelefono}</p>
      <p>Tu pedido ha sido enviado y está en camino.</p>
      <p>Direccion de envío:</p>
      <p>${datos.clienteDireccion}</p>
      <p>${datos.clienteColonia}</p>
      <p>${datos.clienteCiudad}</p>
      <p>${datos.clienteEstado}</p>
      <p>CP: ${datos.clienteCp}</p>
      <br>
      <p>Comentarios del envío: ${datos.comentario}</p>
      <p>Gracias por tu compra.</p>
      <p>Recuerda que puedes consultar el estado de tu pedido en nuestra página web.</p>
      <p>Si tienes alguna duda, no dudes en contactarnos.</p>
      <p>Saludos, El equipo de aKape</p>
      <p>Este es un correo automático, por favor no respondas.</p>
    `;
}

export { generarHTMLEnvio };
