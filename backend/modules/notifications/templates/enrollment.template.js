const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const enrollmentTemplate = ({ userName, courseTitle, courseDuration, enrolledBy }) => ({
  subject: `🎉 You're Enrolled: ${courseTitle} - JNTU-GV NxtGen`,
  html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Enrollment Confirmation</title></head>
<body style="font-family:'Segoe UI',sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:550px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#059669,#10b981);padding:30px;text-align:center;">
      <div style="font-size:48px;margin-bottom:10px;">🎓</div>
      <h1 style="color:#fff;margin:0;font-size:24px;">Enrollment Confirmed!</h1>
      <p style="color:rgba(255,255,255,.9);margin:8px 0 0;font-size:14px;">JNTU-GV NxtGen Certification</p>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#1f2937;margin:0 0 15px;font-size:20px;">Hello ${userName || 'there'}! 👋</h2>
      <p style="color:#6b7280;margin:0 0 25px;line-height:1.6;">You've been enrolled in a new course.</p>
      <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:12px;padding:25px;margin-bottom:25px;">
        <h3 style="color:#166534;margin:0 0 15px;font-size:18px;">📚 Course Details</h3>
        <p style="color:#6b7280;margin:0;font-size:12px;text-transform:uppercase;">Course Title</p>
        <p style="color:#166534;margin:4px 0 12px;font-size:16px;font-weight:bold;">${courseTitle}</p>
        ${courseDuration ? `<p style="color:#6b7280;margin:0;font-size:12px;text-transform:uppercase;">Duration</p><p style="color:#166534;margin:4px 0;font-size:14px;">${courseDuration}</p>` : ''}
      </div>
      <div style="text-align:center;margin-bottom:25px;">
        <a href="${FRONTEND_URL}/profile" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;">Start Learning Now →</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e7eb;">
      ${enrolledBy ? `<p style="color:#6b7280;margin:0 0 10px;font-size:12px;text-align:center;">Enrolled by: <strong>${enrolledBy}</strong></p>` : ''}
      <p style="color:#9ca3af;margin:0;font-size:12px;text-align:center;">© ${new Date().getFullYear()} JNTU-GV NxtGen Certification</p>
    </div>
  </div>
</body>
</html>`,
  text: `Enrollment Confirmed!\n\nHello ${userName || 'there'}!\n\nCourse: ${courseTitle}\n${courseDuration ? `Duration: ${courseDuration}\n` : ''}${enrolledBy ? `Enrolled by: ${enrolledBy}\n` : ''}\nVisit your profile to start learning!`,
});
