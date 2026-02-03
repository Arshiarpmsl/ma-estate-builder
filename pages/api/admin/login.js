import bcrypt from 'bcryptjs'
import { db } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  const trimmedPassword = password?.trim() ?? ''

  if (!trimmedPassword) return res.status(400).json({ error: 'Missing password' })

  const { data: company, error } = await db.from('company').select('admin_password_hash').maybeSingle()

  if (error) {
    console.error('Supabase error in login:', error)
    return res.status(500).json({ error: 'Server error' })
  }

  let valid = false

  if (company?.admin_password_hash) {
    valid = await bcrypt.compare(trimmedPassword, company.admin_password_hash)
  } else {
    const envPassword = process.env.ADMIN_PASSWORD?.trim() ?? ''
    valid = trimmedPassword === envPassword
  }

  if (valid) {
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ error: 'Invalid password' })
}
