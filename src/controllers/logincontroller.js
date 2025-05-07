import bcrypt from 'bcryptjs';
import { pool } from "../models/db.js";

export const getLogin = async (req, res) => {
    try {
        const { Email, password } = req.body;

        const query = 'SELECT Email, Password, Admin FROM usuario WHERE Email = ?';
        const [rows] = await pool.query(query, [Email]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrecto', redirect: '/login' });
        }

        const isMatch = await bcrypt.compare(password, rows[0].Password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrecto', redirect: '/login' });
        }

        const query2 = 'SELECT Idclient, First_Name FROM cliente WHERE Email = ?';
        const [rows2] = await pool.query(query2, [Email]);

        if (rows2.length === 0) {
            return res.status(401).json({ success: false, message: 'Algo anda mal', redirect: '/login' });
        } else {
            req.session.user = {
                email: Email,
                Nombre: rows2[0].First_Name,
                Admin: rows[0].Admin,
                IdCliente: rows2[0].Idclient,
            };

            console.log('Usuario autenticado:', Email, 'IdCliente:', rows2[0].Idclient, 'Admin:', rows[0].Admin, 'Nombre:', rows2[0].First_Name);

            return res.status(200).json({ success: true, message: 'Bienvenido', redirect: '/' });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
