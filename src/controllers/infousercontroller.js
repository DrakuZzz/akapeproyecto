import { pool } from "../models/db.js";

export const getInfo = async (req, res) => {
  try {
    const IdCliente = req.session.user.IdCliente;

    const query =
      "SELECT First_Name, Paterno, Materno, Telefono, Estado, Ciudad, Colonia, Direccion, Cp, Descripcion FROM cliente WHERE Idclient = ?";
    const [rows] = await pool.query(query, [IdCliente]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrecto",
        redirect: "/login",
      });
    } else {
      const info = rows;
      const datos = {
        Nombre: info[0].First_Name,
        Paterno: info[0].Paterno || "",
        Materno: info[0].Materno || "",
        Telefono: info[0].Telefono || "",
        Estado: info[0].Estado || "",
        Ciudad: info[0].Ciudad || "",
        Colonia: info[0].Colonia || "",
        Direccion: info[0].Direccion || "",
        Cp: info[0].Cp || "",
        Descripcion: info[0].Descripcion || "",
      };
      const ordenesQuery = `
        SELECT 
          o.Idorden, 
          o.Fechaorden, 
          o.Fechaenvio, 
          o.Total,
          o.Ordenestado,
          COUNT(d.Idproducto) AS Numero
        FROM orden o
        LEFT JOIN detalle_orden d ON o.Idorden = d.Idorden
        WHERE o.Idclient = ?
        GROUP BY o.Idorden
      `;

      const [ordenes] = await pool.query(ordenesQuery, [IdCliente]);

      datos.Ordenes = ordenes || [];


      res.json(datos);
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const getOrden = async (req, res) => {
  const { orden } = req.body;
  const IdCliente = req.session.user.IdCliente;



  try {
    const ordenDetalleQuery = `
      SELECT 
        o.Idorden, 
        o.Idclient, 
        o.Fechaorden, 
        o.Fechaenvio, 
        o.Fechaentrega, 
        o.Ordenestado, 
        o.Total, 
        o.Tipopago,
        o.ultimos_digitos AS ultimos, 
        d.Idproducto, 
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
    const [ordenes] = await pool.query(ordenDetalleQuery, [orden, IdCliente]);

    if (ordenes.length === 0) {
      return res.status(404).json({ success: false, message: "Orden no encontrada" });
    }

    const [comentarioEnviadoRows] = await pool.query(
      `SELECT comentario FROM comententrega WHERE Idorden = ? AND Ordenestado = 1`,
      [orden]
    );
    const comentarioEnviado = comentarioEnviadoRows.length > 0 ? comentarioEnviadoRows[0].comentario : null;

    const [comentarioEntregadoRows] = await pool.query(
      `SELECT comentario FROM comententrega WHERE Idorden = ? AND Ordenestado = 2`,
      [orden]
    );


    const comentarioEntregado = comentarioEntregadoRows.length > 0 ? comentarioEntregadoRows[0].comentario : null;

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
      ultimos: ordenes[0].ultimos,
      ComentarioEnviado: comentarioEnviado,
      ComentarioEntregado: comentarioEntregado,
      productos: ordenes.map(row => ({
        Idproducto: row.Idproducto,
        Nombre: row.Producto,
        Cantidad: row.Cantidad,
        Precio: row.Precio,
        Subtotal: row.Subtotal
      }))
    };
    res.json(detalle);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
