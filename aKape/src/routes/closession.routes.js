// routes/sessionRoutes.js
import express from 'express';
import { logout} from '../controllers/closescontroller.js';

const router = express.Router();

router.post('', logout);

export default router;
