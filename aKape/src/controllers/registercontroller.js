import { pool } from "../models/db.js";

export const getInsercion = async (req, res) => {
    
    try {
        const { Email, Nombre, password } = req.body;
        const query = 'SELECT Email, password FROM usuario WHERE Email = ? AND Password = ?';
        const [rows] = await pool.query(query, [Email, password]);

        if (rows.length === 0) {
            try {
                const INSERT = 'INSERT INTO usuario (Email, Password) VALUES (?, ?)';
                const [query] = await pool.query(INSERT, [Email, password]);
        
                if (query.affectedRows === 0) {
                    
                    return res.status(401).json({ success: false, message: 'Error al registrar usuario' });
                } else {
                    try {
                        const INSERT2 = 'INSERT INTO cliente (Email, First_Name) VALUES (?, ?)';
                        const [query2] = await pool.query(INSERT2, [Email, Nombre]);
                
                        if (query2.affectedRows === 0) {
                            const query3 = 'DELETE FROM usuario WHERE Email = ?';
                            await pool.query(query3, [Email]);

                            return res.status(401).json({ success: false, message: 'Error al registrar usuario' });

                        } else {
                            return res.status(200).json({ success: true, message: 'Usuario registrado correctamente', redirect: '/login' });
                        }
                    } catch (error) {
                        const query3 = 'DELETE FROM usuario WHERE Email = ?';
                        await pool.query(query3, [Email]);
                        return res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
                        
                    }
                }
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
            }
        } else {
            // Regresa los valores al login.js
            return res.status(401).json({ success: false, message: 'Este usuarios ya existe', redirect: '/register' });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};