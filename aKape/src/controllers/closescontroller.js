
export const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).json({ message: 'Error al cerrar sesión' });
      }
  
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
  };
  