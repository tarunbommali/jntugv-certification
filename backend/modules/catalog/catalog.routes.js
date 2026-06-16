import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as ctrl from './catalog.controller.js';

const router = Router();

router.get('/', ctrl.list);
router.get('/admin', authenticateToken, requireAdmin, ctrl.adminList);
router.get('/:id', ctrl.getById);
router.post('/', authenticateToken, requireAdmin, ctrl.create);
router.put('/:id', authenticateToken, requireAdmin, ctrl.update);
router.delete('/:id', authenticateToken, requireAdmin, ctrl.remove);

router.get('/:id/reviews', ctrl.getReviews);
router.post('/:id/reviews', authenticateToken, ctrl.addReview);

export default router;
