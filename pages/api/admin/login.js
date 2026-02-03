import bcrypt from 'bcryptjs';
import { db } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const { data: company, error } = await db.from('company').select('admin_email, admin_password_hash').single();
  if (error || !company?.admin_password_hash) return res.status(500).json({ error: 'Config error' });

  if (email.toLowerCase() !== company.admin_email) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, company.admin_password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.status(200).json({ success: true });
}
