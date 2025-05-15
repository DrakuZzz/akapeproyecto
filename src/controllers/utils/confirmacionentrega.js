function generarHTMLEntrega(datos) {
    return `
      <h2>Confirmación de la entrega de tu pedido con número de orden #${datos.orden}</h2>
      <p>A nombre de ${datos.nombreCliente}.</p>
      <p>Con número de teléfono: ${datos.clienteTelefono}</p>
      <p>Tu pedido ha sido entregado en la dirección especificada.</p>
      <p>Direccion de entrega:</p>
      <p>${datos.clienteDireccion}</p>
      <p>${datos.clienteColonia}</p>
      <p>${datos.clienteCiudad}</p>
      <p>${datos.clienteEstado}</p>
      <p>CP: ${datos.clienteCp}</p>
      <br>
      <p>Comentarios de la entrega: ${datos.comentario}</p>
      <p>Gracias por tu compra.</p>
      <p>Recuerda que puedes consultar los detalles de tu pedido en nuestra página web.</p>
      <p>Si tienes alguna duda, no dudes en contactarnos.</p>
      <p>Saludos,El equipo de aKape</p>
      <p>Este es un correo automático, por favor no respondas.</p>
    `;
}

export { generarHTMLEntrega };
