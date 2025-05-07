import { pool } from "../models/db.js";
//Aqui hacemos la consulta de los productos y se lo pasamos a las variables para mostrarlas en front
export const getAllCategoria = async (req, res) => {
  try {
    const [rows] = await pool.query("Select distinct categoria from producto;");

    const categorias = rows.map((c) => ({
      categoria: c.categoria,
    }));
    res.json(categorias);
  } catch (err) {
    console.error("Error al obtener las categorias:", err);
    res.status(500).json({ error: "Error al obtener cateogorias" });
  }
};
