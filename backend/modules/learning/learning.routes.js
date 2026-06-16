import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as ctrl from './learning.controller.js';

import { validate } from '../../middleware/validate.js';
import { enrollmentSchema } from './learning.schema.js';

const router = Router();

router.get('/my-enrollments', authenticateToken, ctrl.myEnrollments);
router.get('/user/:userId', authenticateToken, ctrl.byUser);
router.get('/', authenticateToken, requireAdmin, ctrl.adminList);
router.get('/record/:id', authenticateToken, requireAdmin, ctrl.adminGetById);
router.get('/:courseId', authenticateToken, ctrl.byUserAndCourse);
router.post('/', authenticateToken, validate(enrollmentSchema), ctrl.create);
router.put('/:id', authenticateToken, ctrl.update);
router.delete('/:id', authenticateToken, ctrl.remove);

export default router;
