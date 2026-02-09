import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'MA Estate Builder <info@maestatebuilder.co.uk>';
const ADMIN_REPLY_EMAIL = process.env.ADMIN_EMAIL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { to, subject, message, name } = req.body;

  const greeting = name?.trim() ? `Hi ${name.trim()},` : 'Hello,';
  const emailSubject = subject?.trim() || 'Message from MA Estate Builder';

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      replyTo: ADMIN_REPLY_EMAIL,
      subject: emailSubject,
      text: message,
      html: `
        <p>${greeting}</p>
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
