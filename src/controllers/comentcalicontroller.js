import { pool } from "../models/db.js";

export const calificarProducto = async (req, res) => {

    try {
        const { idproducto, comentario, calificacion } = req.body;
        const estrellas = calificacion;

        const idcliente = req.session.user.IdCliente;

        if (!idproducto || !comentario || !estrellas) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
        }

        const fecha = new Date();

        const query2 = `Select * from comentarios where Idproducto = ? and Idclient = ?`;
        const [rows] = await pool.query(query2, [idproducto, idcliente]);
        if (rows.length > 0) {
            const query3 = `UPDATE comentarios SET comentario = ?, estrellas = ?, fecha = ? WHERE Idproducto = ? and Idclient = ?`;
            await pool.query(query3, [comentario, estrellas, fecha, idproducto, idcliente]);
            return res.status(200).json({ success: true, message: "Comentario actualizado correctamente" });
        }
        else {
            const query = `
                INSERT INTO comentarios (Idproducto, Idclient, comentario, estrellas, fecha)
                VALUES (?, ?, ?, ?, ?)
            `;
            await pool.query(query, [idproducto, idcliente, comentario, estrellas, fecha]);

            res.status(200).json({ success: true, message: "Comentario guardado correctamente" });
        }
    } catch (error) {
        console.error("Error al guardar la calificación:", error);
        res.status(500).json({ success: false, message: "Error al guardar el comentario" });
    }

};
