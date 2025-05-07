import { pool } from "../models/db.js";

export const getShowCart = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const IdCliente = req.session.user.IdCliente;
  const Admin = req.session.user.Admin;
  try {
    const query = `
      SELECT p.Idproducto, p.Nombre, p.Precio, c.Cantidad, p.Imagen, (p.Precio * c.Cantidad) AS subtotal
      FROM carrito c
      JOIN producto p ON c.Idproducto = p.Idproducto
      WHERE c.Idclient = ?
    `;
    const [rows] = await pool.query(query, [IdCliente]);

    if (rows.length === 0) {
      return res.status(200).json({
        vacio: 0,
        total: 0,
        envio: 0,
        totalenvio: 0,
      });
    } else {
      const query2 = `
      SELECT SUM(p.Precio * c.Cantidad) AS total
      FROM carrito c
      JOIN producto p ON c.Idproducto = p.Idproducto
      WHERE c.Idclient = ?;
    `;
      const [rows2] = await pool.query(query2, [IdCliente]);

      if (rows.length > 0) {
        // Agregar la información del producto (imagen predeterminada en caso de que no exista)
        const products = rows.map((p) => ({
          Idproducto: p.Idproducto,
          nombre: p.Nombre,
          precio: p.Precio,
          cantidad: p.Cantidad,
          subtotal: p.subtotal,
          imagen: p.Imagen,// O usar una lógica para obtener la imagen
        }));

        console.log(products);
        // Se pasa los productos al front
        if (Admin === 0) {
          res.status(200).json({
            products, // array de productos
            vacio: 1,
            total: rows2[0].total,
            envio: 10,
            totalenvio: parseFloat(rows2[0].total) + 10,
          });
        }
        else if (Admin === 1) {
          res.status(200).json({
            products, // array de productos
            vacio: 1,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error al obtener productos del carrito:", err);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};
