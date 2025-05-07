import { pool } from "../models/db.js";

export const getCart = async (req, res) => {


  if (!req.session.user || !req.session.user.IdCliente) {
    return res.status(400).json({ success: false, message: "Inicia sesión para comprar" });
  }
  // Aquí puedes continuar con tu lógica normal

  else {
    try {
      const { producto } = req.body;
      const IdCliente = req.session.user.IdCliente;


      const [stockRows] = await pool.query(
        "SELECT CantStock FROM inventario WHERE Idproducto = ?",
        [producto]
      );

      if (stockRows.length === 0) {
        return res.status(404).json({ success: false, message: "Producto no encontrado en inventario" });
      }

      const stockDisponible = stockRows[0].CantStock;

      const [rows1] = await pool.query("Select * From producto Where Estado = 1 AND Idproducto = ?",
        [producto]
      )

      if (rows1.length > 0) {
        const [rows] = await pool.query(
          "SELECT Idclient, Idproducto, Cantidad FROM carrito WHERE Idproducto = ? AND Idclient = ?",
          [producto, IdCliente]
        );

        if (rows.length === 0) {
          if (stockDisponible < 1) {
            return res.status(400).json({ success: false, message: "Producto sin stock disponible" });
          }

          try {
            const INSERT = "INSERT INTO carrito (Idclient, Idproducto, Cantidad) VALUES (?, ?, ?)";
            const [query] = await pool.query(INSERT, [IdCliente, producto, 1]);

            if (query.affectedRows === 0) {
              return res.status(500).json({ success: false, message: "Error al agregar al carrito" });
            } else {
              return res.status(200).json({ success: true, message: "Agregado al carrito" });
            }
          } catch (error) {
            return res.status(500).json({ success: false, message: "Error al procesar la solicitud" });
          }

        } else {
          const p = rows[0];
          const nuevaCantidad = p.Cantidad + 1;

          if (nuevaCantidad > stockDisponible) {
            return res.status(400).json({ success: false, message: "Cantidad solicitada excede el stock disponible" });
          }

          try {
            const update = "UPDATE carrito SET Cantidad = ? WHERE IdClient = ? and Idproducto = ?";
            await pool.query(update, [nuevaCantidad, IdCliente, producto]);

            return res.status(200).json({ success: true, message: "Cantidad actualizada en el carrito" });
          } catch {
            return res.status(500).json({ success: false, message: "Error al actualizar el carrito" });
          }
        }
      }
      else {
        return res.status(400).json({ success: false, message: "Producto no disponible" });
      }

    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
};
