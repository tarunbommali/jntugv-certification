/**
 * Notification Service — single entry point for all outbound notifications.
 * Composes templates + email transport. Add SMS/push channels here in future.
 */
import { sendEmail } from './email.service.js';
import { otpTemplate } from './templates/otp.template.js';
import { welcomeTemplate } from './templates/welcome.template.js';
import { enrollmentTemplate } from './templates/enrollment.template.js';
import { certificateTemplate } from './templates/certificate.template.js';

export const sendOtpEmail = async (email, otp, expiryMinutes = 5) => {
  const template = otpTemplate({ otp, expiryMinutes });
  return sendEmail({ to: email, ...template });
};

export const sendWelcomeEmail = async (email, name) => {
  const template = welcomeTemplate({ name });
  return sendEmail({ to: email, ...template });
};

export const sendEnrollmentEmail = async ({ email, userName, courseTitle, courseDuration, enrolledBy }) => {
  const template = enrollmentTemplate({ userName, courseTitle, courseDuration, enrolledBy });
  return sendEmail({ to: email, ...template });
};

export const sendCertificateIssuedEmail = async ({ email, userName, courseTitle, certificateId }) => {
  const template = certificateTemplate({ userName, courseTitle, certificateId });
  return sendEmail({ to: email, ...template });
};
