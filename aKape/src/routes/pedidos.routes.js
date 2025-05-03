// routes/sessionRoutes.js
import { Router } from "express";
import {getPedidos, updatePedido} from "../controllers/pedidoscontroller.js";

const router = Router();

router.get('/pedetalle', getPedidos);
router.post('/pedupda', updatePedido);

export default router;
