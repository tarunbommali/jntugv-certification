/* eslint-disable no-console */
import nodemailer from 'nodemailer';

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  security: process.env.SMTP_SECURITY || 'tls',
  email: process.env.SMTP_EMAIL || process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  fromName: process.env.SMTP_FROM_NAME || 'JNTU-GV NxtGen Certification',
});

const buildTransportOptions = (config) => {
  const port = Number(config.port) || 587;
  const useSSL = config.security === 'ssl' || port === 465;
  return {
    host: config.host,
    port,
    secure: useSSL,
    auth: { user: config.email, pass: config.password },
    tls: config.security === 'tls' ? { rejectUnauthorized: false } : undefined,
    connectionTimeout: 20_000,
  };
};

/**
 * Core send function. Used by notification.service.js — do not call directly from modules.
 */
export const sendEmail = async ({ to, subject, html, text, from, replyTo }) => {
  const config = getSmtpConfig();

  if (!config.email || !config.password) {
    console.warn('[Email] SMTP not configured. Set SMTP_EMAIL and SMTP_PASSWORD in .env');
    return { success: false, message: 'Email service not configured', skipped: true };
  }

  try {
    const transporter = nodemailer.createTransport(buildTransportOptions(config));
    await transporter.verify();

    const info = await transporter.sendMail({
      from: from || `"${config.fromName}" <${config.email}>`,
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>/g, ''),
      replyTo: replyTo || config.email,
    });

    console.log(`[Email] Sent to ${to}. MessageId: ${info.messageId}`);
    return { success: true, message: 'Email sent successfully', messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed:', error.message);

    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH' || error.responseCode === 535) errorMessage = 'SMTP authentication failed.';
    else if (error.code === 'ENOTFOUND' || error.code === 'ECONNECTION') errorMessage = 'Cannot reach SMTP server.';
    else if (error.code === 'ETIMEDOUT') errorMessage = 'SMTP connection timed out.';

    return { success: false, message: errorMessage, error: error.message };
  }
};
