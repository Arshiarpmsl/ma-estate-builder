// pages/api/change-password.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { current_plain_password, new_plain_password } = req.body

    if (!current_plain_password || !new_plain_password || new_plain_password.length < 6) {
      return res.status(400).json({ success: false, error: 'Invalid input' })
    }

    const { data, error } = await supabase.rpc('change_password_secure', {
      current_plain_password,
      new_plain_password,
    })

    if (error) {
      console.error('RPC error:', error.message)
      return res.status(500).json({ success: false, error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}
