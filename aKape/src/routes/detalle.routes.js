import { Router } from "express";
import {crearOrden} from "../controllers/ordenController.js";

const router = Router();
router.post('', crearOrden);

export default router;
