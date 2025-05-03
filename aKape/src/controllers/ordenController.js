import { pool } from "../models/db.js";

// Crear orden y manejar todo el flujo de compra
export const crearOrden = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "No autorizado" });
  }

  const idclient = req.session.user.IdCliente;
  const { productos, totalenvio } = req.body;

  const Ordenestado = 0

  try {

    const [ordenResult] = await pool.query(
      "INSERT INTO orden (Idclient, Ordenestado, Total) VALUES (?, ?, ?)",
      [idclient, Ordenestado, totalenvio]
    );

    const idorden = ordenResult.insertId;

    for (const prod of productos) {
      const { Idproducto, cantidad, precio, subtotal } = prod;

      await pool.query(
        "INSERT INTO detalle_orden (Idorden, Idproducto, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)",
        [idorden, Idproducto, cantidad, precio, subtotal]
      );

      await pool.query(
        "UPDATE inventario SET CantStock = CantStock - ? WHERE Idproducto = ?",
        [cantidad, Idproducto]
      );
    }

    await pool.query(
      "DELETE FROM carrito WHERE Idclient = ?",
      [idclient]
    );


    return res.json({ success: true, idorden });
  } catch (err) {
    console.error("Error al crear orden:", err);
    res.status(500).json({ success: false, error: err.message });
  }

};
