import { Router } from "express";
import {getAllCategoria} from "../controllers/categoriascontroller.js";

const router = Router();
router.get('', getAllCategoria);

export default router;
