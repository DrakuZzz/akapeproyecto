import { pool } from "../models/db.js";

export const cargarComentarios = async (req, res) => {
    try {
        const { idproducto } = req.body;

        const [rows] = await pool.query(
            `SELECT c.comentario, c.estrellas, c.fecha, cli.First_Name 
             FROM comentarios c 
             JOIN cliente cli ON c.Idclient = cli.Idclient
             WHERE c.Idproducto = ?
             ORDER BY c.fecha DESC`,
            [idproducto]
        );

        res.json(rows);
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
        res.status(500).json({ success: false, message: "Error al cargar comentarios" });
    }
};
