import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const FROM_EMAIL = 'MA Estate Builder <info@maestatebuilder.co.uk>';
const ADMIN_REPLY_EMAIL = process.env.ADMIN_EMAIL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { to, subject, message, name } = req.body;
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: to,
      replyTo: ADMIN_REPLY_EMAIL,
      subject: subject || 'Re: Your inquiry with MA Estate Builder',
      text: message,
      html: `
        <p>Hi ${name},</p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>MA Estate Builder Team</p>
      `,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in response handler:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
