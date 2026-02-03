import bcrypt from 'bcryptjs'
import { db } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { currentPassword, newPassword } = req.body

  const trimmedCurrent = currentPassword?.trim() ?? ''
  const trimmedNew = newPassword?.trim() ?? ''

  if (!trimmedCurrent || !trimmedNew || trimmedNew.length < 6) {
    return res.status(400).json({ error: 'Invalid input' })
  }

  const { data: company, error: selectError } = await db.from('company').select('admin_password_hash').maybeSingle()

  if (selectError) {
    console.error('Supabase error in change-password:', selectError)
    return res.status(500).json({ error: 'Server error' })
  }

  let currentValid = false

  if (company?.admin_password_hash) {
    currentValid = await bcrypt.compare(trimmedCurrent, company.admin_password_hash)
  } else {
    const envPassword = process.env.ADMIN_PASSWORD?.trim() ?? ''
    currentValid = trimmedCurrent === envPassword
  }

  if (!currentValid) {
    return res.status(401).json({ error: 'Current password incorrect' })
  }

  const newHash = await bcrypt.hash(trimmedNew, 12)

  const { error: updateError } = await db.from('company').update({ admin_password_hash: newHash })

  if (updateError) {
    console.error('Update error:', updateError)
    return res.status(500).json({ error: 'Failed to save new password' })
  }

  res.status(200).json({ success: true })
}
