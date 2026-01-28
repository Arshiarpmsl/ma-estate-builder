import { useState, useEffect } from 'react'
import Link from 'next/link'
import { db } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageCarousel from '@/components/ImageCarousel'
import Lightbox from '@/components/Lightbox'
import Stars from '@/components/Stars'
import { CheckCircle, ArrowRight, Shield, Award, Users, Clock, ChevronRight, HardHat, Loader2, Star, Heart, ThumbsUp, Zap, Target } from 'lucide-react'

const iconMap = { Shield, Award, Users, Clock, CheckCircle, Star, Heart, ThumbsUp, Zap, Target }

export default function HomePage() {
  const [company, setCompany] = useState(null)
  const [services, setServices] = useState([])
  const [reviews, setReviews] = useState([])
  const [heroImages, setHeroImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)

  // Dynamic settings
  const [heroSettings, setHeroSettings] = useState({})
  const [statsSettings, setStatsSettings] = useState([])
  const [featuresSettings, setFeaturesSettings] = useState([])
  const [ctaSettings, setCtaSettings] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const [c, s, r, h, hero, stats, features, cta] = await Promise.all([
          db.getCompany(), db.getActiveServices(), db.getApprovedReviews(), db.getSiteImages('hero'),
          db.getHomepageSetting('hero'), db.getHomepageSetting('stats'),
          db.getHomepageSetting('features'), db.getHomepageSetting('cta')
        ])
        setCompany(c); setServices(s); setReviews(r); setHeroImages(h)
        setHeroSettings(hero || {}); setStatsSettings(stats || [])
        setFeaturesSettings(features || []); setCtaSettings(cta || {})
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  useEffect(() => {
    if (heroImages?.length > 1) {
      const t = setInterval(() => setHeroIndex(i => (i + 1) % heroImages.length), 5000)
      return () => clearInterval(t)
    }
  }, [heroImages?.length])

  const openLightbox = (imgs, i) => { setLightboxImages(imgs); setLightboxIndex(i) }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <HardHat className="w-10 h-10 text-white"/>
        </div>
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto"/>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header company={company} />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {heroImages?.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{backgroundImage: `linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.9)), url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center'}}/>
        ))}
        <div className="max-w-7xl mx-auto px-4 py-24 text-white relative z-10">
          <div className="max-w-3xl">
            <a href={company?.checkatrade_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2 mb-6 hover:bg-green-600/30 transition-colors cursor-pointer">
              <CheckCircle className="w-5 h-5 text-green-400"/>
              <span className="text-green-300">Checkatrade Approved • {company?.checkatrade_score}/10</span>
            </a>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {heroSettings?.title_line1 || company?.tagline?.split(',')[0]},<br/>
              <span className="text-amber-400">{heroSettings?.title_line2 || company?.tagline?.split(',')[1]}</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              {heroSettings?.subtitle || 'Professional construction services across Sheffield & South Yorkshire.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2">
                {heroSettings?.button1_text || 'Get Free Quote'} <ArrowRight className="w-5 h-5"/>
              </Link>
              <Link href="/services" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg">
                {heroSettings?.button2_text || 'Our Services'}
              </Link>
            </div>
          </div>
        </div>
        {heroImages?.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === heroIndex ? 'bg-amber-500 w-8' : 'bg-white/50'}`}/>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {(statsSettings?.length > 0 ? statsSettings : [
              {value: `${company?.checkatrade_score}/10`, label: "Checkatrade Score"},
              {value: company?.review_count, label: "Reviews"},
              {value: company?.years_experience, label: "Years Experience"},
              {value: "Free", label: "Estimates"}
            ]).map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-amber-500">{s.value}</div>
                <div className="text-slate-600 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Do Best</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">From concept to completion, we deliver exceptional building services.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.slice(0, 6).map(s => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <ImageCarousel images={s.images} height="h-48" onImageClick={openLightbox}/>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="text-amber-600 font-semibold flex items-center gap-2 justify-center">
              View All Services <ChevronRight className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The MA Estate Builder Difference</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {(featuresSettings?.length > 0 ? featuresSettings : [
              {icon: 'Shield', title: 'Fully Insured', desc: 'Complete coverage for peace of mind'},
              {icon: 'Award', title: 'Quality Guaranteed', desc: 'We stand behind every project'},
              {icon: 'Users', title: 'Skilled Tradesmen', desc: 'Experienced specialists'},
              {icon: 'Clock', title: 'Reliable Timelines', desc: 'On-time completion'}
            ]).map((x, i) => {
              const Icon = iconMap[x.icon] || Shield
              return (
                <div key={i} className="text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-amber-600"/>
                  </div>
                  <h3 className="font-bold mb-2">{x.title}</h3>
                  <p className="text-slate-600 text-sm">{x.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Homeowners</h2>
            <div className="flex justify-center items-center gap-2">
              <Stars rating={5}/>
              <span className="text-amber-400">{company?.checkatrade_score}/10 on Checkatrade</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(r => (
              <div key={r.id} className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <Stars rating={r.rating}/>
                <p className="text-slate-200 my-4 italic">"{r.text}"</p>
                <p className="font-semibold">{r.name}</p>
                <p className="text-slate-400 text-sm">{r.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{ctaSettings?.title || "Let's Discuss Your Project"}</h2>
          <p className="text-xl text-white/90 mb-8">{ctaSettings?.subtitle || "Get a free, no-obligation quote."}</p>
          <Link href="/contact" className="inline-block bg-white text-amber-600 px-10 py-4 rounded-full font-bold text-lg">
            {ctaSettings?.button_text || "Get Your Free Quote"}
          </Link>
        </div>
      </section>

      <Footer company={company} />

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