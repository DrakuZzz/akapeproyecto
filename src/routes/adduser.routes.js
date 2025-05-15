import { Router } from 'express';
import { getUser } from '../controllers/addusercontroller.js';

const router = Router();
router.post('', getUser);

export default router;