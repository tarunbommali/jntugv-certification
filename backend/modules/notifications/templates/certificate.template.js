const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const certificateTemplate = ({ userName, courseTitle, certificateId }) => ({
  subject: `🏆 Certificate Issued: ${courseTitle}`,
  html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Certificate Issued</title></head>
<body style="font-family:'Segoe UI',sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:550px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:30px;text-align:center;">
      <div style="font-size:48px;margin-bottom:10px;">🏆</div>
      <h1 style="color:#fff;margin:0;font-size:24px;">Congratulations!</h1>
      <p style="color:rgba(255,255,255,.9);margin:8px 0 0;font-size:14px;">Your Certificate is Ready</p>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#1f2937;margin:0 0 15px;font-size:20px;">Dear ${userName || 'Graduate'}! 🎉</h2>
      <p style="color:#6b7280;margin:0 0 25px;line-height:1.6;">Your certificate for <strong>${courseTitle}</strong> has been officially issued!</p>
      <div style="background:#faf5ff;border:2px solid #c4b5fd;border-radius:8px;padding:20px;text-align:center;margin-bottom:25px;">
        <p style="color:#6b7280;margin:0 0 8px;font-size:12px;">Certificate ID</p>
        <p style="color:#7c3aed;margin:0;font-size:18px;font-weight:bold;font-family:monospace;">${certificateId}</p>
      </div>
      <div style="text-align:center;">
        <a href="${FRONTEND_URL}/profile" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;">Download Certificate</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;margin:0;font-size:12px;text-align:center;">© ${new Date().getFullYear()} JNTU-GV NxtGen Certification</p>
    </div>
  </div>
</body>
</html>`,
});
