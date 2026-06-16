import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as ctrl from './certificates.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireAdmin, ctrl.create);
router.put('/:id', requireAdmin, ctrl.update);
router.delete('/:id', requireAdmin, ctrl.remove);

export default router;
