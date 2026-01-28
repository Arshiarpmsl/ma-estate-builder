import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageCarousel from '@/components/ImageCarousel'
import Lightbox from '@/components/Lightbox'
import CategoryBadge from '@/components/CategoryBadge'

export default function ServicesPage() {
  const [company, setCompany] = useState(null)
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState('all')
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [c, s, cat] = await Promise.all([db.getCompany(), db.getActiveServices(), db.getCategories()])
        setCompany(c); setServices(s); setCategories(cat)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const openLightbox = (imgs, i) => { setLightboxImages(imgs); setLightboxIndex(i) }
  const filtered = selected === 'all' ? services : services.filter(s => s.category === selected)
  const activeCats = categories.filter(c => services.some(s => s.category === c.id))

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />
      <div className="py-20 bg-slate-50 min-h-screen"><div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"><h1 className="text-4xl font-bold mb-4">Our Services</h1><p className="text-slate-600 max-w-2xl mx-auto">Comprehensive building and renovation services across Sheffield and South Yorkshire.</p></div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button onClick={() => setSelected('all')} className={`px-4 py-2 rounded-full font-medium transition-all ${selected === 'all' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-amber-100'}`}>All Services</button>
          {activeCats.map(cat => <button key={cat.id} onClick={() => setSelected(cat.id)} className={`px-4 py-2 rounded-full font-medium transition-all ${selected === cat.id ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-amber-100'}`}>{cat.icon} {cat.name}</button>)}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(s => <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"><ImageCarousel images={s.images} height="h-56" onImageClick={openLightbox}/><div className="p-6"><CategoryBadge category={s.category} categories={categories}/><h3 className="text-xl font-bold mb-3 mt-2">{s.title}</h3><p className="text-slate-600">{s.description}</p></div></div>)}
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-500 py-12">No services in this category.</p>}
      </div></div>
      <Footer company={company} />
      <Lightbox images={lightboxImages} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNext={() => setLightboxIndex(i => (i + 1) % lightboxImages.length)} onPrev={() => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length)} />
    </div>
  )
}