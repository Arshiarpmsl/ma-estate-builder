// pages/api/change-password.js   (or app/api/change-password/route.js if using App Router)

import { createServerClient } from '@supabase/ssr'  // or your server client helper
import { cookies } from 'next/headers'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,  // ← use service_role key here (server-only!)
    { cookies: () => cookieStore }
  )

  // Optional: verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { current_plain_password, new_plain_password } = req.body

  if (!current_plain_password || !new_plain_password || new_plain_password.length < 6) {
    return res.status(400).json({ success: false, error: 'Invalid input' })
  }

  // Call your RPC
  const { data, error } = await supabase.rpc('change_password_secure', {
    current_plain_password,
    new_plain_password
  })

  if (error) {
    console.error('RPC error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }

  return res.status(200).json(data)
}
