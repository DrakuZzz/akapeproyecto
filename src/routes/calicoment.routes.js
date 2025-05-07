import { Router } from 'express';
import { calificarProducto  } from '../controllers/comentcalicontroller.js';

const router = Router();
router.post('', calificarProducto );

export default router;