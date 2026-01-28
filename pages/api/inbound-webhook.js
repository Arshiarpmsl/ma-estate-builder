import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;
const FORWARD_TO = process.env.FORWARD_EMAIL;

export default async function handler(req, res) {
    if (req.method === 'GET') {
      return res.status(200).send('Webhook ready');  // Friendly health check response
    }

    if (req.method !== 'POST') {
      return res.status(405).end();
    }
  // Verify signature (Resend uses Svix-style headers)
  const signature = req.headers['svix-signature'] || req.headers['Svix-Signature'] || '';
  const timestamp = req.headers['svix-timestamp'] || req.headers['Svix-Timestamp'] || '';
  const id = req.headers['svix-id'] || req.headers['Svix-Id'] || '';

  if (!signature || !timestamp || !id) {
    console.error('Missing webhook headers');
    return res.status(401).end();
  }

  const payload = await new Response(req.body).text();  // Raw body as string
  const signedContent = `${id}.${timestamp}.${payload}`;
  const secretBytes = Buffer.from(WEBHOOK_SECRET.replace('whsec_', ''), 'base64');
  const hmac = crypto.createHmac('sha256', secretBytes);
  hmac.update(signedContent);
  const computedSignature = hmac.digest('base64');

  const expectedSignature = `v1,${computedSignature}`;
  if (!crypto.timingSafeEqual(Buffer.from(signature.split(' ')[0]), Buffer.from(expectedSignature))) {
    console.error('Invalid webhook signature');
    return res.status(401).end();
  }

  // Signature valid — process the event
  const event = JSON.parse(payload);

  if (event.type !== 'email.received') {
    return res.status(200).end();
  }

  const emailId = event.data.email_id;

  try {
    await resend.emails.receiving.forward({
      emailId,
      to: FORWARD_TO,
    });

    console.log('Email forwarded successfully to', FORWARD_TO);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Forwarding failed:', error);
    res.status(500).json({ error: 'Failed to forward' });
  }
}