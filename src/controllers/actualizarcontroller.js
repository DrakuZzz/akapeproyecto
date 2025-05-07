import { pool } from "../models/db.js";

export const getActualizar = async (req, res) => {
  const IdCliente = req.session.user.IdCliente;
  const {
    Nombre,
    Paterno,
    Materno,
    Telefono,
    Estado,
    Ciudad,
    Colonia,
    Direccion,
    Cp,
    Descripcion,
    Actualizar,
    Oldpass,
    Password,
  } = req.body;

  if (Actualizar === 1) {
    try {
      const update =
        "UPDATE cliente SET First_Name = ?, Paterno = ?, Materno = ?, Telefono = ?, Estado = ?, Ciudad = ?, Colonia = ?, Direccion = ?, CP = ?, Pais = 'México', Descripcion = ? WHERE Idclient = ?";
      const [query] = await pool.query(update, [
        Nombre,
        Paterno,
        Materno,
        Telefono,
        Estado,
        Ciudad,
        Colonia,
        Direccion,
        Cp,
        Descripcion,
        IdCliente,
      ]);

      return res
        .status(200)
        .json({ success: true, message: "Datos actualizados correctamente" });
    } catch (error) {
      console.error("Error en el servidor:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  } else if (Actualizar === 2) {
    try {
      const update = "UPDATE usuario SET Password = ? WHERE Password = ?";
      const [query] = await pool.query(update, [Password, Oldpass]);
      return res
        .status(200)
        .json({ success: true, message: "Datos actualizados correctamente" });
    } catch (error) {
      console.error("Error en el servidor:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  }
};
