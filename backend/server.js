require('dotenv').config({ path: '../.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, company, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const subjectLabel = {
    products: 'Products Inquiry',
    services: 'Services Inquiry',
    gmp: 'GMP Inquiry',
    partnership: 'Partnership',
    validation: 'Validation',
    other: 'General Inquiry',
  };

  const mailToCompany = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.RECIPIENT_EMAIL,
    subject: `[Etta Systems] ${subjectLabel[subject] || 'New Message'} — ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <div style="background:#0f2d4a;padding:24px 32px;">
          <img src="https://www.ettasystems.com/images/logo.png" alt="Etta Systems" style="height:40px;" />
        </div>
        <div style="padding:32px;">
          <h2 style="color:#0f2d4a;margin-top:0;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#16B5A6;">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#64748b;">Company</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
            ${phone ? `<tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#64748b;">Subject</td><td style="padding:8px 0;">${subjectLabel[subject] || subject || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
          <h3 style="color:#0f2d4a;">Message</h3>
          <p style="color:#334155;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;color:#94a3b8;font-size:13px;">
          Etta Systems — Damascus, Syria &nbsp;|&nbsp; info@ettasystems.com
        </div>
      </div>
    `,
  };

  const mailToSender = {
    from: `"Etta Systems" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'We received your message — Etta Systems',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <div style="background:#0f2d4a;padding:24px 32px;">
          <img src="https://www.ettasystems.com/images/logo.png" alt="Etta Systems" style="height:40px;" />
        </div>
        <div style="padding:32px;">
          <h2 style="color:#0f2d4a;margin-top:0;">Thank you, ${name}!</h2>
          <p style="color:#334155;line-height:1.7;">
            We have received your message and our team will get back to you within <strong>24 business hours</strong>.
          </p>
          <div style="background:#f0fdfb;border-left:4px solid #16B5A6;padding:16px 20px;border-radius:4px;margin:20px 0;">
            <p style="margin:0;color:#334155;font-style:italic;">"${message.substring(0, 200)}${message.length > 200 ? '…' : ''}"</p>
          </div>
          <p style="color:#334155;line-height:1.7;">
            In the meantime, feel free to reach us directly at
            <a href="mailto:info@ettasystems.com" style="color:#16B5A6;">info@ettasystems.com</a>
            or call us at <strong>+963 4880</strong>.
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;color:#94a3b8;font-size:13px;">
          Etta Systems — Damascus, Syria &nbsp;|&nbsp; www.ettasystems.com
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailToCompany);
    await transporter.sendMail(mailToSender);
    res.json({ success: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Etta Systems mailer running on http://localhost:${PORT}`);
});
