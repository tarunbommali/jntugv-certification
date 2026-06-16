export const otpTemplate = ({ otp, expiryMinutes = 5 }) => ({
  subject: 'Password Reset OTP - JNTU-GV NxtGen Certification',
  html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Password Reset OTP</title></head>
<body style="font-family:'Segoe UI',sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">JNTU-GV NxtGen</h1>
      <p style="color:rgba(255,255,255,.9);margin:5px 0 0;font-size:14px;">Certification Platform</p>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#1f2937;margin:0 0 15px;font-size:20px;">Password Reset Request</h2>
      <p style="color:#6b7280;margin:0 0 25px;line-height:1.6;">Use the OTP below to verify your identity:</p>
      <div style="background:#f3f4f6;border:2px dashed #3b82f6;border-radius:8px;padding:25px;text-align:center;margin-bottom:25px;">
        <p style="color:#6b7280;margin:0 0 10px;font-size:14px;">Your One-Time Password</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#1e3a8a;font-family:monospace;">${otp}</div>
      </div>
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 15px;margin-bottom:25px;border-radius:0 8px 8px 0;">
        <p style="color:#92400e;margin:0;font-size:14px;">⏱️ Expires in <strong>${expiryMinutes} minutes</strong></p>
      </div>
      <p style="color:#6b7280;margin:0;font-size:14px;">If you didn't request this, please ignore this email.</p>
    </div>
    <div style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;margin:0;font-size:12px;text-align:center;">© ${new Date().getFullYear()} JNTU-GV NxtGen Certification. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
  text: `JNTU-GV NxtGen - Password Reset\n\nYour OTP: ${otp}\nExpires in: ${expiryMinutes} minutes\n\nIgnore if you did not request this.`,
});
