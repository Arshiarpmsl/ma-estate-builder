import { db } from '@/lib/supabase';
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
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { name, email, phone, message } = req.body;
  try {
    // Save to Supabase (unchanged)
    await db.submitContact({
      name,
      email,
      phone: phone || null,
      message,
    });

    // Admin notification
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Customer thank-you auto-reply
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      replyTo: NOTIFICATION_EMAIL,
      subject: 'Thank you for contacting MA Estate Builder',
      text: `Hi ${name},\n\nThank you for reaching out! We have received your message and will get back to you as soon as possible.\n\nBest regards,\nMA Estate Builder Team`,
      html: `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We have received your message and appreciate you getting in touch.</p>
        <p>One of our team members will review your inquiry and respond to you shortly.</p>
        <p>Best regards,<br><strong>MA Estate Builder Team</strong></p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in contact handler:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
