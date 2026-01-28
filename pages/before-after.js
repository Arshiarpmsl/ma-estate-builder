import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageCarousel from '@/components/ImageCarousel'
import Lightbox from '@/components/Lightbox'

export default function BeforeAfterPage() {
  const [company, setCompany] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (images, startIndex = 0) => {
    setLightboxImages(images)
    setLightboxIndex(startIndex)
  }

  useEffect(() => {
    async function load() {
      try {
        const [c, p] = await Promise.all([db.getCompany(), db.getBeforeAfter()])
        setCompany(c)
        setProjects(p)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-amber-600 text-xl">Loading transformations...</div></div>

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Before & After Transformations</h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              See the dramatic difference our work makes – from tired spaces to stunning results across Sheffield and South Yorkshire.
            </p>
          </div>

          <div className="space-y-20 md:space-y-32">
            {projects.map((p, projectIndex) => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Mobile: Stacked Before/After */}
                <div className="block md:hidden">
                  <div className="relative">
                    <ImageCarousel
                      images={p.before_images || []}
                      height="h-80"
                      autoPlay={false}
                      onImageClick={(imgs, idx) => openLightbox(imgs, idx)}
                    />
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                      Before ({p.before_images?.length || 0})
                    </div>
                  </div>
                  <div className="relative -mt-1">
                    <ImageCarousel
                      images={p.after_images || []}
                      height="h-80"
                      autoPlay={false}
                      onImageClick={(imgs, idx) => openLightbox(imgs, idx)}
                    />
                    <div className="absolute bottom-4 left-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                      After ({p.after_images?.length || 0})
                    </div>
                  </div>
                </div>

                {/* Desktop/Tablet: Side-by-side */}
                <div className="hidden md:grid md:grid-cols-2">
                  <div className="relative">
                    <ImageCarousel
                      images={p.before_images || []}
                      height="h-96"
                      autoPlay={false}
                      onImageClick={(imgs, idx) => openLightbox(imgs, idx)}
                    />
                    <div className="absolute bottom-6 left-6 bg-black/70 text-white px-6 py-3 rounded-xl text-2xl font-bold">
                      Before ({p.before_images?.length || 0})
                    </div>
                  </div>
                  <div className="relative">
                    <ImageCarousel
                      images={p.after_images || []}
                      height="h-96"
                      autoPlay={false}
                      onImageClick={(imgs, idx) => openLightbox(imgs, idx)}
                    />
                    <div className="absolute bottom-6 left-6 bg-amber-600 text-white px-6 py-3 rounded-xl text-2xl font-bold">
                      After ({p.after_images?.length || 0})
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="p-8 md:p-12 bg-gradient-to-r from-slate-50 to-slate-100">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{p.title}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{p.description || 'A stunning transformation completed with care and precision.'}</p>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-slate-500">No before & after projects yet – check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer company={company} />

      {/* Lightbox for zoom */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() => setLightboxIndex(i => (i + 1) % lightboxImages.length)}
        onPrev={() => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </div>
  )
}