import { Router } from 'express';
import { getInsercion } from '../controllers/registercontroller.js';

const router = Router();
router.post('', getInsercion);

export default router;