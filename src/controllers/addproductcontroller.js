import { pool } from "../models/db.js";

// Función para insertar o actualizar productos
export const getInsertProduct = async (req, res) => {

  const {
    nombre,
    precio,
    categoria,
    unidad,
    imagen,
    cantidad,
    descripcion
  } = req.body;

  try {
    const [rows] = await pool.query("SELECT Idproducto FROM producto WHERE Nombre = ?", [nombre]);

    if (rows.length > 0) {
      const idProducto = rows[0].Idproducto;

      // actualiza datos
      await pool.query(
        `UPDATE producto 
         SET Precio = ?, Unidad = ?, Categoria = ?, Descripcion = ?, Imagen = ? 
         WHERE Idproducto = ?`,
        [precio, unidad, categoria, descripcion, imagen, idProducto]
      );

      // actualiza inventario
      await pool.query(
        `UPDATE inventario 
         SET Cantstock = Cantstock + ? 
         WHERE Idproducto = ?`,
        [cantidad, idProducto]
      );

      return res.status(200).json({ success: true, message: "Producto actualizado y stock incrementado" });

    } else {
      const [result] = await pool.query(
        `INSERT INTO producto (Nombre, Precio, Unidad, Categoria, Descripcion, Imagen)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, precio, unidad, categoria, descripcion, imagen]
      );

      if (result.affectedRows === 0) {
        return res.status(500).json({ success: false, message: "Error al insertar producto" });
      }

      const idProducto = result.insertId;

      const [inventarioRes] = await pool.query(
        "INSERT INTO inventario (Idproducto, Cantstock) VALUES (?, ?)",
        [idProducto, cantidad]
      );

      if (inventarioRes.affectedRows === 0) {
        return res.status(500).json({ success: false, message: "Error al insertar en inventario" });
      }

      return res.status(200).json({ success: true, message: "Producto añadido" });
    }

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req, res) => {
  const { idproducto, Estado } = req.body;

  if (!idproducto) {
    return res.status(400).json({ success: false, message: "Falta el ID del producto." });
  }

  try {

    if (Estado === 0) {
      await pool.query("DELETE FROM carrito WHERE Idproducto = ?", [idproducto]);
    }

    const [result] = await pool.query("UPDATE producto SET Estado = ? WHERE Idproducto = ?", [Estado, idproducto]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado." });
    }

    return res.status(200).json({ success: true, message: "Producto deshabilitado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
