import { pool } from "../models/db.js";
import transporter from './utils/mailer.js';
import { generarHTMLPedido } from './utils/plantilla.js';
// Crear orden y manejar todo el flujo de compra
export const crearOrden = async (req, res) => {
  const idclient = req.session.user.IdCliente;
  const { productos, totalenvio, metodo_pago } = req.body;
  let ultimos3 = req.body.ultimos3 || "";

  const Ordenestado = 0;

  try {
    // Inserta la orden
    const [ordenResult] = await pool.query(
      "INSERT INTO orden (Idclient, Ordenestado, Total, Tipopago, ultimos_digitos) VALUES (?, ?, ?, ?, ?)",
      [idclient, Ordenestado, totalenvio, metodo_pago, ultimos3]
    );

    const idorden = ordenResult.insertId;

    // Inserta los detalles de la orden
    for (const prod of productos) {
      const { Idproducto, cantidad, precio, subtotal } = prod;

      await pool.query(
        "INSERT INTO detalle_orden (Idorden, Idproducto, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)",
        [idorden, Idproducto, cantidad, precio, subtotal]
      );

      // Actualiza el inventario
      await pool.query(
        "UPDATE inventario SET CantStock = CantStock - ? WHERE Idproducto = ?",
        [cantidad, Idproducto]
      );
    }

    // Elimina los productos del carrito
    await pool.query(
      "DELETE FROM carrito WHERE Idclient = ?",
      [idclient]
    );


    const clienteCorreo = req.session.user.email;
    const nombreCliente = req.session.user.Nombre;

    await transporter.sendMail({
      from: '"aKape" <akape.ent@gmail.com>',
      to: clienteCorreo,
      subject: `Confirmación de tu pedido #${idorden}`,
      html: generarHTMLPedido({
        orden: idorden,
        nombreCliente,
        total: totalenvio,
        productos
      })
    });

    // Responde con el ID de la orden
    return res.json({ success: true, idorden });
  } catch (err) {
    console.error("Error al crear orden:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};



export const detalleOrden = async (req, res) => {

  const { idorden } = req.body;
  const idclient = req.session.user.IdCliente;

  console.log(idorden)
  try {
    const query = `
      SELECT 
        o.Idorden, 
        o.Idclient, 
        o.Fechaorden, 
        o.Fechaenvio, 
        o.Fechaentrega, 
        o.Ordenestado, 
        o.Total, 
        o.Tipopago, 
        d.Idproducto,
        o.ultimos_digitos AS ultimos3,
        d.Cantidad, 
        d.Precio, 
        d.Subtotal,
        p.Nombre as Producto,
        c.First_name as Nombre,
        c.Paterno,
        c.Materno,
        c.Direccion,
        c.Estado,
        c.Ciudad,
        c.Colonia
      FROM orden o 
      JOIN detalle_orden d ON o.Idorden = d.Idorden 
      JOIN cliente c ON o.Idclient = c.Idclient
      JOIN producto p ON d.Idproducto = p.Idproducto 
      WHERE o.Idorden = ? AND o.Idclient = ?
    `;
    const [ordenes] = await pool.query(query, [idorden, idclient]);
    //Aqui se extrae los valores y se almacen
    const detalle = {
      Nombre: ordenes[0].Nombre,
      Paterno: ordenes[0].Paterno || "",
      Materno: ordenes[0].Materno || "",
      Estado: ordenes[0].Estado || "",
      Ciudad: ordenes[0].Ciudad || "",
      Colonia: ordenes[0].Colonia || "",
      Direccion: ordenes[0].Direccion || "",
      Idorden: ordenes[0].Idorden,
      Fechaorden: ordenes[0].Fechaorden,
      Fechaenvio: ordenes[0].Fechaenvio,
      Fechaentrega: ordenes[0].Fechaentrega,
      Ordenestado: ordenes[0].Ordenestado,
      Total: ordenes[0].Total,
      Tipopago: ordenes[0].Tipopago,
      ultimos3: ordenes[0].ultimos3,
      productos: ordenes.map(row => ({
        Idproducto: row.Idproducto,
        Nombre: row.Producto,
        Cantidad: row.Cantidad,
        Precio: row.Precio,
        Subtotal: row.Subtotal
      }))
    };

    res.json(detalle);

  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }

}