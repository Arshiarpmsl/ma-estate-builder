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

    // Get cookies manually from request headers
    const cookies = req.cookies || {}

    // Optional: refresh session if needed (not strictly required for this RPC)
    const accessToken = cookies['sb-access-token'] || cookies['sb-auth-token']
    if (accessToken) {
      await supabase.auth.setSession({ access_token: accessToken })
    }

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' })
    }

    const { current_plain_password, new_plain_password } = req.body

    if (!current_plain_password || !new_plain_password || new_plain_password.length < 6) {
      return res.status(400).json({ success: false, error: 'Invalid input' })
    }

    const { data, error } = await supabase.rpc('change_password_secure', {
      current_plain_password,
      new_plain_password,
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return res.status(500).json({ success: false, error: 'Server error' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}
