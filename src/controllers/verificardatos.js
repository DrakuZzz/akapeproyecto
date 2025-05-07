import { pool } from "../models/db.js";

export const personalinfo = async (req, res) => {
    const idclient = req.session.user.IdCliente;
    try {
        const query = 'SELECT * FROM cliente WHERE Idclient = ?';
        const [rows] = await pool.query(query, [idclient]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado',
                redirect: '/login'
            });
        }

        const cliente = rows[0];

        console.log("Datos cliente:", cliente);


        // Validar si algún campo importante está vacío o nulo
        const camposRequeridos = [
            cliente.First_Name,
            cliente.Paterno,
            cliente.Telefono,
            cliente.Estado,
            cliente.Ciudad,
            cliente.Colonia,
            cliente.Direccion,
            cliente.CP
        ];

        const datosIncompletos = camposRequeridos.some(campo => {
            if (campo === null || campo === undefined) return true;
            if (typeof campo === 'string' && campo.trim() === '') return true;
            return false;
        });

        if (datosIncompletos) {
            return res.status(400).json({
                success: false,
                message: 'Debes rellenar tus datos personales',
                redirect: '/user#info'
            });
        }

        // Si todo está lleno, redirigir a /pago
        return res.status(200).json({
            success: true,
            redirect: '/orden'
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }

}