import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Stars from '@/components/Stars'
import { CheckCircle } from 'lucide-react'

export default function ReviewsPage() {
  const [company, setCompany] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({ name: '', location: '', rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [c, r] = await Promise.all([db.getCompany(), db.getApprovedReviews()])
        setCompany(c); setReviews(r)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSubmit = async () => {
    if (!newReview.name || !newReview.text) return
    setSubmitting(true)
    try { await db.submitReview(newReview); setSubmitted(true); setNewReview({ name: '', location: '', rating: 5, text: '' }) }
    catch (e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />
      <div className="py-20 bg-slate-50 min-h-screen"><div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"><h1 className="text-4xl font-bold mb-4">Customer Reviews</h1><p className="text-slate-600 max-w-2xl mx-auto mb-6">See what our clients say about working with us.</p><div className="flex justify-center items-center gap-4"><Stars rating={5}/><span className="text-slate-600">{company?.checkatrade_score}/10 on Checkatrade</span></div></div>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {reviews.map(r => <div key={r.id} className="bg-white rounded-2xl p-6 shadow-lg"><Stars rating={r.rating}/><p className="text-slate-700 text-lg italic my-4">"{r.text}"</p><div className="flex justify-between pt-4 border-t"><div><p className="font-bold">{r.name}</p><p className="text-slate-500 text-sm">{r.location}</p></div><p className="text-slate-400 text-sm">{new Date(r.created_at).toLocaleDateString()}</p></div></div>)}
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Leave a Review</h2>
          {submitted ? <div className="text-center py-8"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4"/><p className="text-lg font-semibold">Thank you!</p><p className="text-slate-500">Your review will appear once approved.</p></div> : <>
            <input type="text" placeholder="Your Name *" value={newReview.name} onChange={e=>setNewReview({...newReview,name:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4"/>
            <input type="text" placeholder="Location (e.g. Sheffield)" value={newReview.location} onChange={e=>setNewReview({...newReview,location:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4"/>
            <div className="mb-4"><label className="block mb-2 font-medium">Rating</label><Stars rating={newReview.rating} onClick={r=>setNewReview({...newReview,rating:r})}/></div>
            <textarea placeholder="Your review *" rows={4} value={newReview.text} onChange={e=>setNewReview({...newReview,text:e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4"/>
            <button onClick={handleSubmit} disabled={submitting||!newReview.name||!newReview.text} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </>}
        </div>
      </div></div>
      <Footer company={company} />
    </div>
  )
}
