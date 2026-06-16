import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import * as PaymentsRepo from './payments.repository.js';
import * as CoursesRepo from '../catalog/catalog.repository.js';
import * as LearningRepo from '../learning/learning.repository.js';
import * as LearningService from '../learning/learning.service.js';
import * as AdminService from '../admin/admin.service.js';
import { env } from '../../config/env.js';

export const listPayments = async (filters) => PaymentsRepo.findAll(filters);

export const myPayments = async (userId) => PaymentsRepo.findByUser(userId);

export const createPayment = async (body, userId) => {
  const paymentRecordId = randomUUID();
  const gatewayOrderId = `ORDER-${randomUUID().slice(0, 8).toUpperCase()}`;

  return PaymentsRepo.create({
    id: paymentRecordId,
    ...body,
    userId,
    orderId: gatewayOrderId,
    status: 'CREATED',
  });
};

const GST_RATE = 0.18;

const requireRazorpayConfig = () => {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw Object.assign(new Error('Razorpay is not configured on the server'), { statusCode: 503 });
  }
};

const createGatewayOrder = async ({ amount, currency, receipt, notes }) => {
  const credentials = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.id) {
    const message = payload?.error?.description || 'Unable to create Razorpay order';
    throw Object.assign(new Error(message), { statusCode: 502 });
  }
  return payload;
};

const calculatePricing = async (course, couponCode) => {
  const subtotal = Math.max(0, Number(course.price) || 0);
  let coupon = null;
  let couponDiscount = 0;

  if (couponCode) {
    coupon = await AdminService.fetchCouponByCode(couponCode);
    const evaluation = AdminService.evaluateCoupon(coupon, {
      amount: subtotal,
      courseId: course.id,
    });
    if (!evaluation.valid) {
      throw Object.assign(new Error(evaluation.message || 'Invalid coupon'), { statusCode: 400 });
    }
    couponDiscount = Math.min(subtotal, Math.max(0, Number(evaluation.discount) || 0));
  }

  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const tax = Math.round(taxableAmount * GST_RATE);
  const total = taxableAmount + tax;

  return {
    subtotal,
    couponDiscount,
    taxableAmount,
    tax,
    taxRate: GST_RATE,
    total,
    coupon,
  };
};

const recordCouponUse = async (couponCode, discount) => {
  if (!couponCode) return;
  const coupon = await AdminService.fetchCouponByCode(couponCode);
  if (!coupon) return;

  await AdminService.updateCoupon(coupon.id, {
    usedCount: (coupon.usedCount || 0) + 1,
    totalOrders: (coupon.totalOrders || 0) + 1,
    totalDiscountGiven: (coupon.totalDiscountGiven || 0) + (discount || 0),
    updatedAt: new Date(),
  });
};

export const createRazorpayOrder = async (body, user) => {
  const course = await CoursesRepo.findById(body.courseId);
  if (!course || !course.isPublished || course.status !== 'published') {
    throw Object.assign(new Error('Course is not available for enrollment'), { statusCode: 404 });
  }

  const existingEnrollment = await LearningRepo.findByUserAndCourse(user.id, course.id);
  if (existingEnrollment) {
    throw Object.assign(new Error('You are already enrolled in this course'), { statusCode: 409 });
  }

  const pricing = await calculatePricing(course, body.couponCode);
  if (pricing.total <= 0) {
    const freePaymentId = `free_${randomUUID()}`;
    const enrollment = await LearningService.createEnrollment({
      courseId: course.id,
      courseTitle: course.title,
      status: 'ACTIVE',
      paymentData: {
        method: pricing.coupon ? 'coupon' : 'free',
        paymentId: freePaymentId,
        amount: 0,
        amountPaid: 0,
        currency: course.currency || 'INR',
        couponCode: pricing.coupon?.code || null,
        couponDiscount: pricing.couponDiscount,
        billingInfo: body.billingInfo,
      },
    }, user, { paymentVerified: true });

    const payment = await PaymentsRepo.create({
      id: randomUUID(),
      paymentId: freePaymentId,
      orderId: null,
      enrollmentId: enrollment.id,
      userId: user.id,
      courseId: course.id,
      courseTitle: course.title,
      amount: 0,
      currency: course.currency || 'INR',
      status: 'CAPTURED',
      couponCode: pricing.coupon?.code || null,
      couponDiscount: pricing.couponDiscount,
      pricing: {
        subtotal: pricing.subtotal,
        couponDiscount: pricing.couponDiscount,
        taxableAmount: 0,
        tax: 0,
        taxRate: pricing.taxRate,
        total: 0,
        billingInfo: body.billingInfo,
      },
      capturedAt: new Date(),
    });

    await recordCouponUse(pricing.coupon?.code, pricing.couponDiscount);
    return { free: true, enrollment, payment };
  }

  requireRazorpayConfig();
  const recordId = randomUUID();
  const receipt = `course_${recordId.replace(/-/g, '').slice(0, 24)}`;
  const gatewayOrder = await createGatewayOrder({
    amount: pricing.total * 100,
    currency: course.currency || 'INR',
    receipt,
    notes: {
      courseId: course.id,
      userId: user.id,
    },
  });

  await PaymentsRepo.create({
    id: recordId,
    paymentId: `pending_${recordId}`,
    orderId: gatewayOrder.id,
    userId: user.id,
    courseId: course.id,
    courseTitle: course.title,
    amount: pricing.total,
    currency: gatewayOrder.currency || course.currency || 'INR',
    status: 'CREATED',
    couponCode: pricing.coupon?.code || null,
    couponDiscount: pricing.couponDiscount,
    pricing: {
      subtotal: pricing.subtotal,
      couponDiscount: pricing.couponDiscount,
      taxableAmount: pricing.taxableAmount,
      tax: pricing.tax,
      taxRate: pricing.taxRate,
      total: pricing.total,
      billingInfo: body.billingInfo,
    },
    razorpayData: { order: gatewayOrder },
  });

  return {
    keyId: env.RAZORPAY_KEY_ID,
    orderId: gatewayOrder.id,
    amount: gatewayOrder.amount,
    currency: gatewayOrder.currency,
    course: { id: course.id, title: course.title },
    pricing: {
      subtotal: pricing.subtotal,
      couponDiscount: pricing.couponDiscount,
      tax: pricing.tax,
      taxRate: pricing.taxRate,
      total: pricing.total,
    },
  };
};

export const verifyRazorpayPayment = async (body, user) => {
  requireRazorpayConfig();

  const payment = await PaymentsRepo.findByOrderId(body.razorpayOrderId);
  if (!payment || payment.userId !== user.id) {
    throw Object.assign(new Error('Payment order not found'), { statusCode: 404 });
  }

  if (payment.enrollmentId) {
    const enrollment = await LearningRepo.findById(payment.enrollmentId);
    return { payment, enrollment };
  }

  const expected = createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
    .digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(body.razorpaySignature);
  const signatureValid = expectedBuffer.length === receivedBuffer.length
    && timingSafeEqual(expectedBuffer, receivedBuffer);

  if (!signatureValid) {
    await PaymentsRepo.updateById(payment.id, {
      status: 'FAILED',
      razorpayData: { ...(payment.razorpayData || {}), verificationFailedAt: new Date().toISOString() },
      updatedAt: new Date(),
    });
    throw Object.assign(new Error('Payment signature verification failed'), { statusCode: 400 });
  }

  const existingEnrollment = await LearningRepo.findByUserAndCourse(user.id, payment.courseId);
  const enrollment = existingEnrollment || await LearningService.createEnrollment({
    courseId: payment.courseId,
    courseTitle: payment.courseTitle,
    status: 'ACTIVE',
    paymentData: {
      method: 'razorpay',
      paymentId: body.razorpayPaymentId,
      amount: payment.amount,
      amountPaid: payment.amount,
      currency: payment.currency,
      couponCode: payment.couponCode,
      couponDiscount: payment.couponDiscount,
      razorpay: {
        orderId: body.razorpayOrderId,
        paymentId: body.razorpayPaymentId,
        signature: body.razorpaySignature,
      },
      billingInfo: payment.pricing?.billingInfo,
    },
  }, user, { paymentVerified: true });

  const updatedPayment = await PaymentsRepo.updateById(payment.id, {
    paymentId: body.razorpayPaymentId,
    enrollmentId: enrollment.id,
    status: 'CAPTURED',
    capturedAt: new Date(),
    razorpayData: {
      ...(payment.razorpayData || {}),
      paymentId: body.razorpayPaymentId,
      signature: body.razorpaySignature,
    },
    updatedAt: new Date(),
  });

  await recordCouponUse(payment.couponCode, payment.couponDiscount);

  return { payment: updatedPayment, enrollment };
};

export const updatePayment = async (paymentId, body, requestingUser) => {
  const existing = await PaymentsRepo.findByPaymentId(paymentId);
  if (!existing) throw Object.assign(new Error('Payment not found'), { statusCode: 404 });
  if (existing.userId !== requestingUser.id && !requestingUser.isAdmin) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  return PaymentsRepo.update(paymentId, body);
};
