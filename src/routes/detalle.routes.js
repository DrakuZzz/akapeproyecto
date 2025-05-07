import { Router } from "express";
import {crearOrden, detalleOrden} from "../controllers/ordenController.js";

const router = Router();
router.post('/crear', crearOrden);
router.post('/detalles', detalleOrden)

export default router;
