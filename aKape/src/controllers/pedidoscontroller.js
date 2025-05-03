
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
                'UPDATE orden SET Ordenestado = ?, Fechaentrega = ?, Comentario = ? WHERE Idorden = ?',
                [ordenestado, Fechaentrega, comentario, orden]
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