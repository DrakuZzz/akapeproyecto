
import { pool } from "../models/db.js";
//Aqui hacemos la consulta de los productos y se lo pasamos a las variables para mostrarlas en front
export const getPedidos = async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT * FROM orden WHERE Ordenestado != 2;');

        //Aqui se extrae los valores y se almacena
        const pedido = rows.map(p => ({
            Idorden: p.Idorden,
            Ordenestado: p.Ordenestado
        }));
        //Se le pasa los valores al front mediante el json
        console.log(pedido)
        res.json(pedido);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }

};

export const getDatos = async (req, res) => {

    const { orden } = req.body;
    console.log(orden)

    try {
        const [row] = await pool.query(
            'SELECT cli.First_name, cli.Paterno, cli.Telefono, cli.Estado, cli.Ciudad, cli.Colonia, cli.Direccion, cli.Cp, cli.Descripcion FROM cliente cli INNER JOIN orden o ON cli.Idclient = o.Idclient WHERE o.Idorden = ?;',
            [orden]
        );

        if (row.length === 0) {
            return res.json({ success: false, message: "Orden no encontrada" });
        }

        res.json({
            success: true,
            cliente: row[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error en el servidor." });
    }

}

export const updatePedido = async (req, res) => {

    const { orden, comentario, ordenestado } = req.body;
    const Fechaenvio = new Date();
    const Fechaentrega = new Date();
    try {
        if (ordenestado == 1) {
            const [rows2] = await pool.query(
                'UPDATE orden SET Ordenestado = ?, Fechaenvio = ? WHERE Idorden = ?',
                [ordenestado, Fechaenvio, orden]

            );
            const [rows3] = await pool.query('Insert into comententrega (Idorden, Ordenestado, comentario) Values (?, ?, ?)', [orden, ordenestado, comentario]);

            if (rows2.affectedRows > 0) {
                res.status(200).json({ message: 'Pedido actualizado', redirect: '/pedidos' });
            } else {
                res.status(500).json({ message: 'Error al actualizar pedido', redirect: '/pedidos' });
            }
        } else if (ordenestado == 2) {
            const [rows2] = await pool.query(
                'UPDATE orden SET Ordenestado = ?, Fechaentrega = ? WHERE Idorden = ?',
                [ordenestado, Fechaentrega, orden]
            );
            const [rows3] = await pool.query('Insert into comententrega (Idorden, Ordenestado, comentario) Values (?, ?, ?)', [orden, ordenestado, comentario]);
            if (rows2.affectedRows > 0) {
                res.status(200).json({ message: 'Pedido actualizado', redirect: '/pedidos' });
            } else {
                res.status(500).json({ message: 'Error al actualizar pedido', redirect: '/pedidos' });
            }
        }
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }

}