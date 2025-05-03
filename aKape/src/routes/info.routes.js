import { Router } from "express";
import {getInfo, getOrden} from "../controllers/infousercontroller.js";

const router = Router();
router.get('/userinfo', getInfo);
router.post('/ordenes', getOrden);

export default router;
