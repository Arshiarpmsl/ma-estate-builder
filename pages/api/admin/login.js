import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  const trimmedPassword = password?.trim() ?? ''

  if (!trimmedPassword) return res.status(400).json({ error: 'Missing password' })

  // Get the company row
  const { data: company, error: fetchError } = await supabase
    .from('company')
    .select('admin_password_hash')
    .single()

  if (fetchError) {
    console.error('Fetch error:', fetchError)
    // Fallback to env var if DB fail
    if (trimmedPassword === process.env.ADMIN_PASSWORD?.trim()) {
      return res.status(200).json({ success: true })
    }
    return res.status(500).json({ error: 'Server error' })
  }

  let valid = false
  if (company?.admin_password_hash) {
    valid = await bcrypt.compare(trimmedPassword, company.admin_password_hash)
  } else {
    valid = trimmedPassword === process.env.ADMIN_PASSWORD?.trim()
  }

  if (valid) {
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ error: 'Invalid password' })
}
