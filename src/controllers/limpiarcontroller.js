import { pool } from "../models/db.js";

// Consulta para obtener los productos en el carrito y el total
export const getLimpiar = async (req, res) => {
  const IdCliente = req.session.user.IdCliente;
  const { objeto } = req.body;
  const { valor } = req.body;
  console.log(objeto);

  if (valor === "limpiar") {
    try {
      const query3 = "DELETE FROM carrito WHERE Idclient = ?";
      await pool.query(query3, [IdCliente]);
      return res.status(200).json({ success: false, message: "Limpiadito" });
    } catch {
      return res.status(500);
    }
  } else {
    const query =
      "SELECT Idclient, Idproducto, Cantidad FROM carrito WHERE Idproducto = ? AND Idclient = ?";
    const [rows] = await pool.query(query, [objeto, IdCliente]);

    if (rows.length > 0) {
      const p = rows[0];
      const currentQuantity = p.Cantidad;

      const stockQuery = "SELECT CantStock FROM inventario WHERE Idproducto = ?";
      const [stockRows] = await pool.query(stockQuery, [objeto]);

      if (stockRows.length === 0) {
        return res.status(404).json({ success: false, message: "Producto no encontrado en inventario" });
      }

      const stock = stockRows[0].CantStock;

      if (valor === "Aumentar") {
        if (currentQuantity + 1 > stock) {
          return res.status(400).json({ success: false, message: "No hay suficiente stock para aumentar la cantidad" });
        }
        try {
          const monto = currentQuantity + 1;
          const update =
            "UPDATE carrito SET Cantidad = ? WHERE IdClient = ? and Idproducto = ?";
          await pool.query(update, [monto, IdCliente, objeto]);
          return res.status(200).json();
        } catch {
          return res.status(500).json({ success: false, message: "Error al actualizar la cantidad" });
        }
      } else if (valor === "Disminuir") {
        if (currentQuantity - 1 < 1) {
          return res.status(400).json({ success: false, message: "La cantidad no puede ser menor que 1" });
        }
        try {
          const monto = currentQuantity - 1;
          const update2 =
            "UPDATE carrito SET Cantidad = ? WHERE IdClient = ? and Idproducto = ?";
          await pool.query(update2, [monto, IdCliente, objeto]);
          return res.status(200).json();
        } catch {
          return res.status(500).json({ success: false, message: "Error al actualizar la cantidad" });
        }
      } else if (valor === "Eliminar") {
        try {
          const deletes =
            "DELETE FROM carrito WHERE IdClient = ? and Idproducto = ?";
          await pool.query(deletes, [IdCliente, objeto]);
          return res.status(200).json();
        } catch {
          return res.status(500).json({ success: false, message: "Error al eliminar el producto del carrito" });
        }
      }
    } else {
      return res.status(404).json({ success: false, message: "Producto no encontrado en el carrito" });
    }
  }
};
