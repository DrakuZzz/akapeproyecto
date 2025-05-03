import { pool } from "../models/db.js";

export const calificarProducto = async (req, res) => {
    if (!req.session.user.IdCliente) {
        return res.status(400).json({ success: false, message: "Inicia sesión para comentar" });
    }
    else {
        try {
            const { idproducto, comentario, calificacion } = req.body;
            const estrellas = calificacion;

            const idcliente = req.session.user.IdCliente;

            if (!idproducto || !comentario || !estrellas) {
                return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
            }

            const fecha = new Date();

            const query = `
        INSERT INTO comentarios (Idproducto, Idclient, comentario, estrellas, fecha)
        VALUES (?, ?, ?, ?, ?)
      `;
            await pool.query(query, [idproducto, idcliente, comentario, estrellas, fecha]);

            res.status(200).json({ success: true, message: "Comentario guardado correctamente" });
        } catch (error) {
            console.error("Error al guardar la calificación:", error);
            res.status(500).json({ success: false, message: "Error al guardar el comentario" });
        }
    }

};
