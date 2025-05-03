import { Router } from 'express';
import { getCart } from '../controllers/addcartcontroller.js';

const router = Router();
router.post('', getCart);

export default router;