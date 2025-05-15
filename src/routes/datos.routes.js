import { Router } from 'express';
import { getActualizar } from '../controllers/actualizarcontroller.js';

const router = Router();
router.post('', getActualizar);

export default router;