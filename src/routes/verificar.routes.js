import { Router } from "express";
import {personalinfo} from "../controllers/verificardatos.js";

const router = Router();
router.get('/verificar', personalinfo);

export default router;
