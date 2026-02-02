// pages/api/change-password.js

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // ← must be in Vercel env vars (server-only!)
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: (name, value, options) => cookieStore.set({ name, value, ...options }),
          remove: (name, options) => cookieStore.delete({ name, ...options }),
        },
      }
    )

    // Verify user is authenticated (optional but good practice)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
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
      console.error('RPC error:', error)
      return res.status(500).json({ success: false, error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Change password API error:', err)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}
