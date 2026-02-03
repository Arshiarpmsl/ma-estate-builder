export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { password } = req.body
  const trimmedPassword = password?.trim()
  if (trimmedPassword === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true })
  }
  return res.status(401).json({ error: 'Invalid password' })
}
