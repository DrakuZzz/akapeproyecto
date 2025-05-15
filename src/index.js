import express from "express";
import path from "path";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import Swal from 'sweetalert2'
import { PORT } from "./config.js";
import {
  productosRoutes,
  registerRoutes,
  loginRoutes,
  sessionRoutes,
  closesRoutes,
  categoriaRoutes,
  addcartRoutes,
  showcartRoutes,
  limpiarRoutes,
  infoRoutes,
  datosRoutes,
  addRoutes,
  inforproductoroutes,
  uploadRoutes,
  comentarioRoutes,
  calificarRoutes,
  detalleRoutes,
  pedidoRoutes,
  verificarRoutes,
  añadirUsuarioRoutes
} from "./routes/index.js";
const app = express();

Swal.fire({
  title: 'Error!',
  text: 'Do you want to continue',
  icon: 'error',
  confirmButtonText: 'Cool'
})

process.setMaxListeners(40);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("src"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "dmalkmoanfianfpanfpawnf",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(uploadRoutes);
app.use('/addusuario', añadirUsuarioRoutes);
app.use('/images', express.static(path.resolve('src/images')));
app.use(sessionRoutes);
app.use("/logout", closesRoutes);
app.use("/cargar/comentarios", comentarioRoutes);
app.use("/calificacion/producto", calificarRoutes);
app.use("/registro/insercion", registerRoutes);
app.use("/login/datos", loginRoutes);
app.use("/productos", productosRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/agregar/carrito", addcartRoutes);
app.use("/mostrar/carrito", showcartRoutes);
app.use("/limpiar", limpiarRoutes);
app.use("", infoRoutes)
app.use("/actualizar", datosRoutes)
app.use(addRoutes)
app.use("/obtenerprodcuto", inforproductoroutes)
app.use("/orden", detalleRoutes)
app.use("", pedidoRoutes)
app.use("", verificarRoutes)

//Pagina de inicio con los productos
app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/pages/index.html"));
});

app.get("/adduser", (req, res) => {
  res.sendFile(path.resolve("src/pages/adduser.html"));
});

//Pagina del producto seleccionado con su información
app.get("/product", (req, res) => {
  res.sendFile(path.resolve("src/pages/product.html"));
});

//Página de Nosotros
app.get("/us", (req, res) => {
  res.sendFile(path.resolve("src/pages/us.html"));
});

//Formularios de registro
app.get("/login", (req, res) => {
  res.sendFile(path.resolve("src/pages/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.resolve("src/pages/register.html"));
});

//Privilegios de los usuarios
app.get("/cart", (req, res) => {
  res.sendFile(path.resolve("src/pages/cart.html"));
});

app.get("/modif", (req, res) => {
  res.sendFile(path.resolve("src/pages/modif.html"));
});

//Cosas del usuario
app.get("/user", (req, res) => {
  res.sendFile(path.resolve("src/pages/user.html"));
});

app.get("/info", (req, res) => {
  res.sendFile(path.resolve("src/pages/user/info.html"));
});

app.get("/orders", (req, res) => {
  res.sendFile(path.resolve("src/pages/user/orders.html"));
});

app.get("/pedidos", (req, res) => {
  res.sendFile(path.resolve("src/pages/pedidos.html"));
});


app.get("/orden", (req, res) => {
  res.sendFile(path.resolve("src/pages/orden.html"));
});

app.get("/orden/confirmacion", (req, res) => {
  res.sendFile(path.resolve("src/pages/detalle_orden.html"));
});

//Headers
app.get("/header", (req, res) => {
  res.sendFile(path.resolve("src/pages/headers/header.html"));
});

app.get("/adminheader", (req, res) => {
  res.sendFile(path.resolve("src/pages/headers/adminheader.html"));
});

//Sidebars
app.get("/sidebar", (req, res) => {
  res.sendFile(path.resolve("src/pages/sidebars/sidebar.html"));
});

app.get("/usersidebar", (req, res) => {
  res.sendFile(path.resolve("src/pages/sidebars/usersidebar.html"));
});

app.listen(PORT, () => {
  console.log("Servidor corriendo", PORT);
});
