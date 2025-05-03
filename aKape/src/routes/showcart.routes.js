import { Router } from "express";
import {getShowCart} from "../controllers/cartcontroller.js";

const router = Router();
router.get('', getShowCart);

export default router;
