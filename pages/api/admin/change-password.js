import bcrypt from 'bcryptjs'
import { db } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { currentPassword, newPassword } = req.body

  const trimmedCurrent = currentPassword?.trim()
  const trimmedNew = newPassword?.trim()

  if (!trimmedCurrent || !trimmedNew || trimmedNew.length < 6) {
    return res.status(400).json({ error: 'Invalid input' })
  }

  // Verify current password against env var (since you reverted login to simple)
  if (trimmedCurrent !== process.env.ADMIN_PASSWORD?.trim()) {
    return res.status(401).json({ error: 'Current password incorrect' })
  }

  const hash = await bcrypt.hash(trimmedNew, 12)

  await db.from('company').update({ admin_password_hash: hash })

  res.status(200).json({ success: true })
}
