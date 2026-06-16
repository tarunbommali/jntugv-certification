import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as ctrl from './payments.controller.js';
import { handleWebhook } from './webhook.controller.js';

import { validate } from '../../middleware/validate.js';
import {
  createOrderSchema,
  createPaymentSchema,
  verifyPaymentSchema,
} from './payments.schema.js';

const router = Router();

router.get('/', authenticateToken, requireAdmin, ctrl.list);
router.get('/my-payments', authenticateToken, ctrl.myPayments);
router.post('/order', authenticateToken, validate(createOrderSchema), ctrl.createOrder);
router.post('/verify', authenticateToken, validate(verifyPaymentSchema), ctrl.verify);
router.post('/', authenticateToken, validate(createPaymentSchema), ctrl.create);
router.post('/webhook', handleWebhook);
router.put('/:paymentId', authenticateToken, ctrl.update);

export default router;
