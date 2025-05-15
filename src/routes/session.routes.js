// routes/sessionRoutes.js
import express from 'express';
import { getSessionUser} from '../controllers/sessioncontroller.js';

const router = express.Router();

router.get('/session-user', getSessionUser);

export default router;
