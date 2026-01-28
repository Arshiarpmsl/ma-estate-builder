import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageCarousel from '@/components/ImageCarousel'
import { CheckCircle, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  const [company, setCompany] = useState(null)
  const [aboutImages, setAboutImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [c, imgs] = await Promise.all([db.getCompany(), db.getSiteImages('about')])
        setCompany(c); setAboutImages(imgs)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />
      <div className="py-20 bg-white min-h-screen"><div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">About MA Estate Builder</h1>
            <p className="text-slate-600 text-lg mb-6">{company?.about}</p>
            <p className="text-slate-600 mb-8">{company?.about_extended}</p>
            <div className="bg-slate-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Company Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Owner:</span><p className="font-semibold">{company?.owner}</p></div>
                <div><span className="text-slate-500">Location:</span><p className="font-semibold">{company?.address}</p></div>
                <div><span className="text-slate-500">Checkatrade Member:</span><p className="font-semibold">Since {company?.checkatrade_member}</p></div>
                <div><span className="text-slate-500">Free Estimates:</span><p className="font-semibold">{company?.free_estimates}</p></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[{l:"Checkatrade Score",v:`${company?.checkatrade_score}/10`},{l:"Reviews",v:company?.review_count},{l:"Experience",v:company?.years_experience},{l:"Free Quotes",v:"Yes"}].map((x,i)=><div key={i} className="bg-amber-50 rounded-xl p-4"><div className="text-2xl font-bold text-amber-600">{x.v}</div><div className="text-slate-600 text-sm">{x.l}</div></div>)}
            </div>
            <a href={company?.checkatrade_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"><CheckCircle className="w-5 h-5"/> View Checkatrade Profile <ExternalLink className="w-4 h-4"/></a>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl"><ImageCarousel images={aboutImages} height="h-96" autoPlay={true}/></div>
        </div>
      </div></div>
      <Footer company={company} />
    </div>
  )
}