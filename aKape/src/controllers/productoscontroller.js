
import { pool } from "../models/db.js";
//Aqui hacemos la consulta de los productos y se lo pasamos a las variables para mostrarlas en front
export const getAllProductos = async(req, res) => {
  const { valor } = req.body;
  console.log('Valor recibido:', valor);  

  if (!valor) {
    try {
      const [rows] = await pool.query('SELECT * FROM producto');

      //Aqui se extrae los valores y se almacena
      const productos = rows.map(p => ({
        Idproducto: p.Idproducto,
        nombre: p.Nombre,
        precio: p.Precio,
        unidad: p.Unidad,
        imagen: p.Imagen,
        Estado: p.Estado
      }));
      //Se le pasa los valores al front mediante el json
      res.json(productos);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  } else {
    try {
      const query = 'SELECT * FROM producto WHERE categoria = ?';
      const [rows] = await pool.query(query, [valor]);
      //Aqui se extrae los valores y se almacena
      const productos = rows.map(p => ({
        Idproducto: p.Idproducto,
        nombre: p.Nombre,
        precio: p.Precio,
        unidad: p.Unidad,
        imagen: p.Imagen,
        Estado: p.Estado
      }));

      //Se le pasa los valores al front mediante el json
      res.json(productos);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }
};