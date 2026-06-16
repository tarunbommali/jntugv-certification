import { Router } from 'express';
import { publicRealtime } from './public.controller.js';

const router = Router();

router.get('/realtime', publicRealtime);

export default router;
