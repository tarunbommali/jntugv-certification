export const welcomeTemplate = ({ name }) => ({
  subject: 'Welcome to JNTU-GV NxtGen Certification!',
  html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="font-family:'Segoe UI',sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Welcome to JNTU-GV NxtGen!</h1>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#1f2937;margin:0 0 15px;font-size:20px;">Hello ${name || 'there'}! 👋</h2>
      <p style="color:#6b7280;margin:0 0 25px;line-height:1.6;">Thank you for joining our certification platform. Start learning and earning certifications today!</p>
    </div>
    <div style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;margin:0;font-size:12px;text-align:center;">© ${new Date().getFullYear()} JNTU-GV NxtGen Certification</p>
    </div>
  </div>
</body>
</html>`,
});
