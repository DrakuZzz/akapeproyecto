import bcrypt from 'bcryptjs';
import { pool } from "../models/db.js";

export const getUser = async (req, res) => {
    try {
        const { email,
            nombre,
            paterno,
            materno,
            telefono,
            rango,
            password, } = req.body;

        const query = 'SELECT Email FROM usuario WHERE Email = ?';
        const [rows] = await pool.query(query, [email]);

        if (rows.length > 0) {
            return res.status(401).json({ success: false, message: 'Este usuario ya existe', redirect: '/register' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const INSERT = 'INSERT INTO usuario (Email, Password, Admin) VALUES (?, ?, ?)';
        const [userInsertResult] = await pool.query(INSERT, [email, hashedPassword, rango]);

        if (userInsertResult.affectedRows === 0) {
            return res.status(401).json({ success: false, message: 'Error al registrar usuario' });
        }

        const INSERT2 = 'INSERT INTO cliente (Email, First_Name, Paterno, Materno, Telefono) VALUES (?, ?, ?, ?, ?)';
        const [clientInsertResult] = await pool.query(INSERT2, [email, nombre, paterno, materno, telefono]);

        if (clientInsertResult.affectedRows === 0) {
            const deleteUserQuery = 'DELETE FROM usuario WHERE Email = ?';
            await pool.query(deleteUserQuery, [email]);

            return res.status(401).json({ success: false, message: 'Error al registrar usuario en la base de datos de cliente' });
        }

        // 5. Todo ha sido exitoso
        return res.status(200).json({ success: true, message: 'Usuario registrado correctamente', redirect: '/login' });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
