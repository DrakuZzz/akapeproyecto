import { Router } from "express";
import {getInfoProducto} from "../controllers/infoproductcontroller.js";

const router = Router();
router.post('', getInfoProducto);

export default router;
