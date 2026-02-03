import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { currentPassword, newPassword } = req.body

  const trimmedCurrent = currentPassword?.trim() ?? ''
  const trimmedNew = newPassword?.trim() ?? ''

  if (!trimmedCurrent || !trimmedNew || trimmedNew.length < 6) {
    return res.status(400).json({ error: 'Invalid input or password too short' })
  }

  // Get the company row (assumes single row)
  const { data: company, error: fetchError } = await supabase
    .from('company')
    .select('id, admin_password_hash')
    .single()

  if (fetchError || !company) {
    console.error('Fetch error:', fetchError)
    return res.status(500).json({ error: 'Failed to load config' })
  }

  // Verify current password
  let currentValid = false
  if (company.admin_password_hash) {
    currentValid = await bcrypt.compare(trimmedCurrent, company.admin_password_hash)
  } else {
    currentValid = trimmedCurrent === process.env.ADMIN_PASSWORD?.trim()
  }

  if (!currentValid) {
    return res.status(401).json({ error: 'Current password incorrect' })
  }

  // Save new hash
  const newHash = await bcrypt.hash(trimmedNew, 12)

  const { error: updateError } = await supabase
    .from('company')
    .update({ admin_password_hash: newHash })
    .eq('id', company.id)

  if (updateError) {
    console.error('Update error:', updateError)
    return res.status(500).json({ error: 'Failed to save new password' })
  }

  res.status(200).json({ success: true })
}
