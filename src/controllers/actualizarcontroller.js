import { pool } from "../models/db.js";
import bcrypt from 'bcryptjs';

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
      const email = req.session.user.email;

      // Buscar la contraseña actual en la base de datos
      const [rows] = await pool.query("SELECT Password FROM usuario WHERE email = ?", [email]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      const hashedPassword = rows[0].Password;

      const match = await bcrypt.compare(Oldpass, hashedPassword);
      if (!match) {
        return res.status(401).json({ success: false, message: "La contraseña actual es incorrecta" });
      }

      const newHashedPassword = await bcrypt.hash(Password, 10);

      await pool.query("UPDATE usuario SET Password = ? WHERE email = ?", [newHashedPassword, email]);

      return res.status(200).json({ success: true, message: "Contraseña actualizada correctamente" });

    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

};
