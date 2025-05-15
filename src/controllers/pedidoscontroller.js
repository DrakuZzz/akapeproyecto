
import { pool } from "../models/db.js";
import transporter from './utils/mailer.js';
import { generarHTMLEnvio } from './utils/confirmacionenvio.js';
import { generarHTMLEntrega } from './utils/confirmacionentrega.js';
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

        const [row] = await pool.query(
            'SELECT us.Email, cli.First_Name, cli.Paterno, cli.Telefono, cli.Estado, cli.Ciudad, cli.Colonia, cli.Direccion, cli.Cp, cli.Descripcion FROM cliente cli INNER JOIN orden o ON cli.Idclient = o.Idclient INNER JOIN usuario us ON cli.Email = us.Email WHERE o.Idorden = ?;',
            [orden]
        );
        if (row.length > 0) {
            if (ordenestado == 1) {
                const [rows2] = await pool.query(
                    'UPDATE orden SET Ordenestado = ?, Fechaenvio = ? WHERE Idorden = ?',
                    [ordenestado, Fechaenvio, orden]

                );
                const [rows3] = await pool.query('Insert into comententrega (Idorden, Ordenestado, comentario) Values (?, ?, ?)', [orden, ordenestado, comentario]);

                if (rows2.affectedRows > 0) {
                    const clienteCorreo = row[0].Email;
                    const clienteTelefono = row[0].Telefono;
                    const clienteEstado = row[0].Estado;
                    const clienteCiudad = row[0].Ciudad;
                    const clienteColonia = row[0].Colonia;
                    const clienteDireccion = row[0].Direccion;
                    const clienteCp = row[0].Cp;
                    const nombreCliente = `${row[0].First_Name} ${row[0].Paterno}`;
                    await transporter.sendMail({
                        from: '"aKape" <akape.ent@gmail.com>',
                        to: clienteCorreo,
                        subject: `Confirmación de envío de pedido #${orden}`,
                        html: generarHTMLEnvio({
                            orden: orden,
                            nombreCliente,
                            clienteTelefono,
                            clienteEstado,
                            clienteCiudad,
                            clienteColonia,
                            clienteDireccion,
                            clienteCp,
                            comentario: comentario
                        })
                    });

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
                    const clienteCorreo = row[0].Email;
                    const clienteTelefono = row[0].Telefono;
                    const clienteEstado = row[0].Estado;
                    const clienteCiudad = row[0].Ciudad;
                    const clienteColonia = row[0].Colonia;
                    const clienteDireccion = row[0].Direccion;
                    const clienteCp = row[0].Cp;
                    const nombreCliente = `${row[0].First_Name} ${row[0].Paterno}`;
                    await transporter.sendMail({
                        from: '"aKape" <akape.ent@gmail.com>',
                        to: clienteCorreo,
                        subject: `Confirmación de entrega de pedido #${orden}`,
                        html: generarHTMLEntrega({
                            orden: orden,
                            nombreCliente,
                            clienteTelefono,
                            clienteEstado,
                            clienteCiudad,
                            clienteColonia,
                            clienteDireccion,
                            clienteCp,
                            comentario: comentario
                        })
                    });
                    res.status(200).json({ message: 'Pedido actualizado', redirect: '/pedidos' });
                } else {
                    res.status(500).json({ message: 'Error al actualizar pedido', redirect: '/pedidos' });
                }
            }
        }
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }

}