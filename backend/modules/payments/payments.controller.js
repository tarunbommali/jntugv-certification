import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as PaymentsService from './payments.service.js';

export const list = asyncHandler(async (req, res) => {
  const data = await PaymentsService.listPayments(req.query);
  res.json({ success: true, data });
});

export const myPayments = asyncHandler(async (req, res) => {
  const data = await PaymentsService.myPayments(req.user.id);
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await PaymentsService.createPayment(req.body, req.user.id);
  res.status(201).json({ success: true, data });
});

export const createOrder = asyncHandler(async (req, res) => {
  const data = await PaymentsService.createRazorpayOrder(req.body, req.user);
  res.status(201).json({ success: true, data });
});

export const verify = asyncHandler(async (req, res) => {
  const data = await PaymentsService.verifyRazorpayPayment(req.body, req.user);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await PaymentsService.updatePayment(req.params.paymentId, req.body, req.user);
  res.json({ success: true, data });
});
