import { randomUUID, createHmac } from 'crypto';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as PaymentsRepo from './payments.repository.js';

export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).json({ success: false, error: 'Missing signature or unconfigured webhook secret' });
  }

  const expectedSignature = createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
  }

  let payloadObj;
  try {
    payloadObj = JSON.parse(req.body);
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
  }

  const event = payloadObj.event;
  const paymentData = payloadObj.payload?.payment?.entity;
  if (!paymentData) return res.status(400).json({ success: false, error: 'Invalid payload structure' });

  // Idempotency check
  const existingLog = await PaymentsRepo.findWebhookLog(paymentData.id, event);
  if (existingLog) return res.status(200).json({ success: true, message: 'Already processed' });

  await PaymentsRepo.createWebhookLog({
    id: randomUUID(), paymentId: paymentData.id, orderId: paymentData.order_id, event, payload: payloadObj,
  });

  const internalPayment = await PaymentsRepo.findByOrderId(paymentData.order_id);
  if (internalPayment) {
    if (event === 'payment.captured' || event === 'payment.authorized') {
      await PaymentsRepo.updateById(internalPayment.id, { status: 'CAPTURED', paymentId: paymentData.id, capturedAt: new Date(), updatedAt: new Date() });
    } else if (event === 'payment.failed') {
      await PaymentsRepo.updateById(internalPayment.id, { status: 'FAILED', paymentId: paymentData.id, updatedAt: new Date() });
    }
  }

  res.status(200).json({ success: true });
});
