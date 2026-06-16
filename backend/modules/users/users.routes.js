import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as ctrl from './users.controller.js';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);

export default router;
