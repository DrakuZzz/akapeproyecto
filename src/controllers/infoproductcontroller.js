import { pool } from "../models/db.js";

export const getInfoProducto = async (req, res) => {
    try {
        const valor = req.body.valor;
        const producto = req.body.producto;
        console.log("Producto solicitado:", valor);

        // Obtener información del producto
        const [productoRows] = await pool.query("SELECT * FROM producto WHERE Nombre = ? or Idproducto = ?", [valor, producto]);

        if (productoRows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "No existe este producto",
                redirect: "/",
            });
        }

        const info = productoRows[0];

        const [calificacionRows] = await pool.query(
            "SELECT AVG(estrellas) AS promedio FROM comentarios WHERE Idproducto = ?",
            [info.Idproducto]
        );

        const [producstock] = await pool.query("Select Cantstock from inventario WHERE Idproducto = ?", [info.Idproducto])

        const stock = producstock[0].Cantstock

        const calificacion = parseFloat(calificacionRows[0].promedio) || 0;

        const datos = {
            idproducto: info.Idproducto,
            nombre: info.Nombre || "",
            precio: info.Precio || "",
            unidad: info.Unidad || "",
            categoria: info.Categoria || "",
            descripcion: info.Descripcion || "",
            imagen: info.Imagen,
            estado: info.Estado,
            calificacion: calificacion.toFixed(1),
            stock: stock    
        };

        res.json(datos);
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error interno del servidor" });
    }
};
