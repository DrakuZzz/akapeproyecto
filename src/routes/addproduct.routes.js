import { Router } from 'express'; import { getInsertProduct, deleteProduct } from "../controllers/addproductcontroller.js"; // O donde tengas tu controlador

const router = Router();
// Ruta para añadir o actualizar producto
router.post("/addprod", getInsertProduct);

// Ruta para eliminar producto
router.post("/deleteprod", deleteProduct);

export default router;