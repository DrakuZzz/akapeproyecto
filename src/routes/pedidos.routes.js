// routes/sessionRoutes.js
import { Router } from "express";
import {getPedidos, updatePedido, getDatos} from "../controllers/pedidoscontroller.js";

const router = Router();

router.get('/pedetalle', getPedidos);
router.post('/pedupda', updatePedido);
router.post('/pedatos', getDatos)

export default router;
