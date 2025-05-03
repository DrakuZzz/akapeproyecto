export const getSessionUser = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      loggedIn: true,
      Nombre: req.session.user.Nombre,
      Admin: req.session.user.Admin,
      IdCliente: req.session.user.IdCliente,
      email: req.session.user.email,
    });
  } else {
    return res.status(200).json({ loggedIn: false });
  }
};
