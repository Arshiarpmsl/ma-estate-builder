import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageCarousel from '@/components/ImageCarousel'
import Lightbox from '@/components/Lightbox'
import CategoryBadge from '@/components/CategoryBadge'

export default function GalleryPage() {
  const [company, setCompany] = useState(null)
  const [gallery, setGallery] = useState([])
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState('all')
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [c, g, cat] = await Promise.all([db.getCompany(), db.getGallery(), db.getCategories()])
        setCompany(c); setGallery(g); setCategories(cat)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const openLightbox = (imgs, i) => { setLightboxImages(imgs); setLightboxIndex(i) }
  const filtered = selected === 'all' ? gallery : gallery.filter(g => g.category === selected)
  const activeCats = categories.filter(c => gallery.some(g => g.category === c.id))

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />
      <div className="py-20 bg-slate-50 min-h-screen"><div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"><h1 className="text-4xl font-bold mb-4">Our Recent Projects</h1><p className="text-slate-600 max-w-2xl mx-auto">Browse our portfolio of completed work.</p></div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button onClick={() => setSelected('all')} className={`px-4 py-2 rounded-full font-medium transition-all ${selected === 'all' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-amber-100'}`}>All</button>
          {activeCats.map(cat => <button key={cat.id} onClick={() => setSelected(cat.id)} className={`px-4 py-2 rounded-full font-medium transition-all ${selected === cat.id ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-amber-100'}`}>{cat.icon} {cat.name}</button>)}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer" onClick={() => openLightbox(item.images, 0)}><ImageCarousel images={item.images} height="h-64"/><div className="p-4"><h3 className="font-bold text-lg">{item.title}</h3><div className="flex items-center justify-between mt-2"><CategoryBadge category={item.category} categories={categories}/><span className="text-slate-500 text-sm">{item.images?.length || 0} photos</span></div></div></div>)}
        </div>
      </div></div>
      <Footer company={company} />
      <Lightbox images={lightboxImages} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNext={() => setLightboxIndex(i => (i + 1) % lightboxImages.length)} onPrev={() => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length)} />
    </div>
  )
}