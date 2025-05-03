import { Router } from "express";
import {getAllProductos} from "../controllers/productoscontroller.js";

const router = Router();
router.post('', getAllProductos);

export default router;
