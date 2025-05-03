import { Router } from 'express';
import { cargarComentarios } from '../controllers/comentariocontroller.js';

const router = Router();
router.post('', cargarComentarios);

export default router;