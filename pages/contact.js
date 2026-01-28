import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, Send, CheckCircle, ExternalLink } from 'lucide-react'

export default function ContactPage() {
  const [company, setCompany] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { db.getCompany().then(setCompany).catch(console.error) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { setError('Please fill all required fields'); return }
    setSubmitting(true); setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch (e) {
      setError('Failed to send. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-center p-8 bg-white rounded-2xl shadow-lg"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/><h1 className="text-2xl font-bold mb-2">Message Sent!</h1><p className="text-slate-600 mb-4">We'll get back to you soon.</p><a href="/" className="text-amber-600 font-semibold">Return to Home</a></div></div>

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />
      <div className="py-20 bg-slate-50 min-h-screen"><div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"><h1 className="text-4xl font-bold mb-4">Get In Touch</h1><p className="text-slate-600">Ready to start? Fill out the form or call us.</p></div>
        <div className="grid lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}
            <input type="text" placeholder="Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4" required/>
            <input type="email" placeholder="Email *" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4" required/>
            <input type="tel" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4"/>
            <textarea placeholder="Tell us about your project *" rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4" required/>
            <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">{submitting ? 'Sending...' : <><Send className="w-5 h-5"/> Send Message</>}</button>
          </form>
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <a href={`tel:${company?.phone}`} className="flex items-center gap-4 mb-4 hover:text-amber-600"><div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><Phone className="text-amber-600"/></div><div><p className="text-sm text-slate-500">Phone</p><p className="font-semibold">{company?.phone}</p></div></a>
              <a href={`mailto:${company?.email}`} className="flex items-center gap-4 mb-4 hover:text-amber-600"><div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><Mail className="text-amber-600"/></div><div><p className="text-sm text-slate-500">Email</p><p className="font-semibold">{company?.email}</p></div></a>
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><MapPin className="text-amber-600"/></div><div><p className="text-sm text-slate-500">Location</p><p className="font-semibold">{company?.address}</p></div></div>
            </div>
            <div className="bg-green-600 rounded-2xl p-6 text-white"><div className="flex items-center gap-3 mb-4"><CheckCircle className="w-8 h-8"/><h3 className="text-xl font-bold">Checkatrade Verified</h3></div><p className="mb-4">{company?.checkatrade_score}/10 average rating</p><a href={company?.checkatrade_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg font-semibold">View Profile <ExternalLink className="w-4 h-4"/></a></div>
          </div>
        </div>
      </div></div>
      <Footer company={company} />
    </div>
  )
}