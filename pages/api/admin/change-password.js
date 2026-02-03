// New file: pages/api/admin/change-password.js
import bcrypt from 'bcryptjs';
import { db } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match or missing fields' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const { data: company, error } = await db.from('company').select('admin_password_hash').single();

  if (error || !company?.admin_password_hash) {
    return res.status(500).json({ error: 'Admin configuration error' });
  }

  const isValid = await bcrypt.compare(currentPassword, company.admin_password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  await db.from('company').update({ admin_password_hash: newHash });

  res.status(200).json({ success: true });
}
