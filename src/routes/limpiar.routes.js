import { Router } from "express";
import {getLimpiar} from "../controllers/limpiarcontroller.js";

const router = Router();
router.post('', getLimpiar);

export default router;
