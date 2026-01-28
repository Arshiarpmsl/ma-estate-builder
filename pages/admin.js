import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import Stars from '@/components/Stars'
import { Settings, Building2, Hammer, Image, MessageSquare, User, Eye, EyeOff, LogOut, Save, Plus, Trash2, X, Loader2, Mail, Home, Edit2, RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState('homepage')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)

  const [company, setCompany] = useState({})
  const [services, setServices] = useState([])
  const [gallery, setGallery] = useState([])
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [heroImages, setHeroImages] = useState([])
  const [aboutImages, setAboutImages] = useState([])
  const [contacts, setContacts] = useState([])

  // Before & After state – now multiple images
  const [beforeAfter, setBeforeAfter] = useState([])
  const [editingBeforeAfter, setEditingBeforeAfter] = useState(null)
  const [newBeforeAfter, setNewBeforeAfter] = useState({ title: '', description: '', before_images: [], after_images: [] })

  const [heroSettings, setHeroSettings] = useState({})
  const [statsSettings, setStatsSettings] = useState([])
  const [featuresSettings, setFeaturesSettings] = useState([])
  const [ctaSettings, setCtaSettings] = useState({})

  // Edit states for services and gallery
  const [editingService, setEditingService] = useState(null)
  const [editingGallery, setEditingGallery] = useState(null)

  const [newService, setNewService] = useState({ title: '', description: '', category: 'general', images: [] })
  const [newGallery, setNewGallery] = useState({ title: '', category: 'general', images: [] })
  const [tempUrl, setTempUrl] = useState('')

  // Reply modal state
  const [replyingTo, setReplyingTo] = useState(null)
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('ma_admin') === 'true') { setAuth(true); loadAll() }
    else setLoading(false)
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const companyData = await db.getCompany().catch(() => ({}))
      const servicesData = await db.getServices().catch(() => [])
      const galleryData = await db.getGallery().catch(() => [])
      const reviewsData = await db.getAllReviews().catch(() => [])
      const categoriesData = await db.getCategories().catch(() => [])
      const heroImgData = await db.getSiteImages('hero').catch(() => [])
      const aboutImgData = await db.getSiteImages('about').catch(() => [])
      const contactsData = await db.getContactSubmissions().catch(() => [])
      const beforeAfterData = await db.getBeforeAfter().catch(() => [])

      const heroSet = await db.getHomepageSetting('hero').catch(() => ({}))
      const statsSet = await db.getHomepageSetting('stats').catch(() => [])
      const featuresSet = await db.getHomepageSetting('features').catch(() => [])
      const ctaSet = await db.getHomepageSetting('cta').catch(() => ({}))

      setCompany(companyData || {})
      setServices(servicesData)
      setGallery(galleryData)
      setReviews(reviewsData)
      setCategories(categoriesData)
      setHeroImages(heroImgData)
      setAboutImages(aboutImgData)
      setContacts(contactsData)
      setBeforeAfter(beforeAfterData)
      setHeroSettings(heroSet)
      setStatsSettings(statsSet)
      setFeaturesSettings(featuresSet)
      setCtaSettings(ctaSet)
    } catch (e) {
      console.error(e)
      show('Partial load – check console', true)
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (res.ok) { sessionStorage.setItem('ma_admin', 'true'); setAuth(true); setPassword(''); loadAll() }
      else setLoginError('Invalid password')
    } catch (e) { setLoginError('Login failed') }
  }

  const logout = () => { sessionStorage.removeItem('ma_admin'); setAuth(false) }
  const show = (m, err = false) => { setMsg({ m, err }); setTimeout(() => setMsg(null), 3000) }

  const upload = (cb) => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true
    i.onchange = async (e) => {
      for (const f of Array.from(e.target.files)) {
        try { const url = await db.uploadImage(f); cb(url) } catch (e) { show('Upload failed', true) }
      }
    }
    i.click()
  }

  if (!auth) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md">
        <div className="text-center mb-6"><div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4"><Settings className="w-8 h-8 text-white"/></div><h1 className="text-2xl font-bold">Admin Login</h1></div>
        {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
        <div className="relative mb-4"><input type={showPw?"text":"password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyPress={e=>e.key==='Enter'&&login()} className="w-full px-4 py-3 border rounded-xl pr-12"/><button onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPw?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div>
        <button onClick={login} className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700">Login</button>
      </div>
    </div>
  )

  if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500"/></div>

  const Tab = ({id,icon:I,label}) => <button onClick={()=>setTab(id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap ${tab===id?'bg-amber-500 text-white':'text-slate-600 hover:bg-slate-100'}`}><I className="w-5 h-5"/><span className="hidden sm:inline">{label}</span></button>

  const Imgs = ({images,setImages,label}) => (
    <div><label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {images?.map((img,i)=><div key={i} className="relative group w-24 h-20"><img src={img} alt="" className="w-full h-full object-cover rounded-lg"/><button onClick={()=>setImages(images.filter((_,idx)=>idx!==i))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"><X className="w-4 h-4"/></button></div>)}
        <button onClick={()=>upload(url=>setImages([...(images||[]),url]))} className="w-24 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-amber-500 hover:text-amber-500"><Plus className="w-6 h-6"/><span className="text-xs">Upload</span></button>
      </div>
      <div className="flex gap-2"><input placeholder="Or paste URL" value={tempUrl} onChange={e=>setTempUrl(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm"/><button onClick={()=>{if(tempUrl){setImages([...(images||[]),tempUrl]);setTempUrl('')}}} className="px-4 py-2 bg-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300">Add</button></div>
    </div>
  )

  const iconOptions = ['Shield', 'Award', 'Users', 'Clock', 'CheckCircle', 'Star', 'Heart', 'ThumbsUp', 'Zap', 'Target']

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow-sm border-b"><div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center"><h1 className="text-2xl font-bold">Admin Panel</h1><div className="flex items-center gap-4">{msg&&<span className={`text-sm ${msg.err?'text-red-600':'text-green-600'}`}>{msg.m}</span>}<button onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-700"><LogOut className="w-5 h-5"/>Logout</button></div></div></div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Tab id="homepage" icon={Home} label="Homepage"/>
          <Tab id="company" icon={Building2} label="Company"/>
          <Tab id="about" icon={User} label="About Page"/>
          <Tab id="services" icon={Hammer} label="Services"/>
          <Tab id="gallery" icon={Image} label="Gallery"/>
          <Tab id="beforeafter" icon={RefreshCw} label="Before & After"/>
          <Tab id="reviews" icon={MessageSquare} label="Reviews"/>
          <Tab id="messages" icon={Mail} label="Messages"/>
        </div>

        {/* HOMEPAGE TAB */}
        {tab==='homepage'&&<div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Hero Carousel & Text</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-medium mb-1">Title Line 1</label><input value={heroSettings.title_line1||''} onChange={e=>setHeroSettings({...heroSettings,title_line1:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
              <div><label className="block text-sm font-medium mb-1">Title Line 2</label><input value={heroSettings.title_line2||''} onChange={e=>setHeroSettings({...heroSettings,title_line2:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Subtitle</label><input value={heroSettings.subtitle||''} onChange={e=>setHeroSettings({...heroSettings,subtitle:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
              <div><label className="block text-sm font-medium mb-1">Button 1 Text</label><input value={heroSettings.button1_text||''} onChange={e=>setHeroSettings({...heroSettings,button1_text:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
              <div><label className="block text-sm font-medium mb-1">Button 2 Text</label><input value={heroSettings.button2_text||''} onChange={e=>setHeroSettings({...heroSettings,button2_text:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
            </div>
            <Imgs images={heroImages} setImages={async imgs=>{setHeroImages(imgs);await db.updateSiteImages('hero',imgs);loadAll();show('Hero carousel updated!')}} label="Hero Background Images (carousel)"/>
            <button onClick={async()=>{await db.updateHomepageSetting('hero',heroSettings);show('Hero text saved!')}} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save Hero Text</button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Stats Section</h2>
            <div className="space-y-3">
              {statsSettings.map((stat,i)=>(
                <div key={i} className="flex gap-2 items-center">
                  <input value={stat.value||''} onChange={e=>{const n=[...statsSettings];n[i].value=e.target.value;setStatsSettings(n)}} className="w-32 px-3 py-2 border rounded-lg"/>
                  <input value={stat.label||''} onChange={e=>{const n=[...statsSettings];n[i].label=e.target.value;setStatsSettings(n)}} className="flex-1 px-3 py-2 border rounded-lg"/>
                  <button onClick={()=>setStatsSettings(statsSettings.filter((_,idx)=>idx!==i))} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                </div>
              ))}
              <button onClick={()=>setStatsSettings([...statsSettings,{value:'',label:''}])} className="text-amber-600 flex items-center gap-1"><Plus className="w-4 h-4"/>Add Stat</button>
            </div>
            <button onClick={async()=>{await db.updateHomepageSetting('stats',statsSettings);show('Stats saved!')}} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save Stats</button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Features Section</h2>
            <div className="space-y-4">
              {featuresSettings.map((feat,i)=>(
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex gap-2 items-start">
                    <select value={feat.icon||'Shield'} onChange={e=>{const n=[...featuresSettings];n[i].icon=e.target.value;setFeaturesSettings(n)}} className="px-3 py-2 border rounded-lg">
                      {iconOptions.map(ic=><option key={ic} value={ic}>{ic}</option>)}
                    </select>
                    <input value={feat.title||''} onChange={e=>{const n=[...featuresSettings];n[i].title=e.target.value;setFeaturesSettings(n)}} className="flex-1 px-3 py-2 border rounded-lg" placeholder="Title"/>
                    <button onClick={()=>setFeaturesSettings(featuresSettings.filter((_,idx)=>idx!==i))} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                  </div>
                  <input value={feat.desc||''} onChange={e=>{const n=[...featuresSettings];n[i].desc=e.target.value;setFeaturesSettings(n)}} className="w-full mt-2 px-3 py-2 border rounded-lg" placeholder="Description"/>
                </div>
              ))}
              <button onClick={()=>setFeaturesSettings([...featuresSettings,{icon:'Shield',title:'',desc:''}])} className="text-amber-600 flex items-center gap-1"><Plus className="w-4 h-4"/>Add Feature</button>
            </div>
            <button onClick={async()=>{await db.updateHomepageSetting('features',featuresSettings);show('Features saved!')}} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save Features</button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Call to Action Section</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input value={ctaSettings.title||''} onChange={e=>setCtaSettings({...ctaSettings,title:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
              <div><label className="block text-sm font-medium mb-1">Subtitle</label><input value={ctaSettings.subtitle||''} onChange={e=>setCtaSettings({...ctaSettings,subtitle:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
              <div><label className="block text-sm font-medium mb-1">Button Text</label><input value={ctaSettings.button_text||''} onChange={e=>setCtaSettings({...ctaSettings,button_text:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
            </div>
            <button onClick={async()=>{await db.updateHomepageSetting('cta',ctaSettings);show('CTA saved!')}} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save CTA</button>
          </div>
        </div>}

        {/* COMPANY TAB */}
        {tab==='company'&&<div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Company Information</h2>
          {Object.keys(company).length === 0 ? <p className="text-slate-500 text-center py-8">No company data yet – fill and save below</p> : null}
          <div className="grid md:grid-cols-2 gap-4">
            {[{k:'name',l:'Company Name'},{k:'tagline',l:'Tagline'},{k:'phone',l:'Phone'},{k:'email',l:'Email'},{k:'address',l:'Address'},{k:'owner',l:'Owner'},{k:'checkatrade_url',l:'Checkatrade URL'},{k:'checkatrade_score',l:'Score'},{k:'review_count',l:'Review Count'},{k:'years_experience',l:'Experience'},{k:'checkatrade_member',l:'Member Since'},{k:'free_estimates',l:'Free Estimates'}].map(({k,l})=><div key={k}><label className="block text-sm font-medium text-slate-600 mb-1">{l}</label><input value={company[k]||''} onChange={e=>setCompany({...company,[k]:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>)}
          </div>
          <button onClick={async()=>{try{await db.updateCompany(company);loadAll();show('Saved!')}catch(e){show('Failed',true)}}} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save Company Details</button>
        </div>}

        {/* ABOUT PAGE TAB */}
        {tab==='about'&&<div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">About Page Full Content</h2>
            <p className="text-slate-600 mb-6">Edit the main text paragraphs and carousel images for the About page. Company details (owner, address, Checkatrade, stats, etc.) are edited in the Company tab.</p>
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-1">Main About Paragraph</label>
                <textarea value={company.about||''} onChange={e=>setCompany({...company,about:e.target.value})} rows={6} className="w-full px-4 py-2 border rounded-xl"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Extended About Paragraph</label>
                <textarea value={company.about_extended||''} onChange={e=>setCompany({...company,about_extended:e.target.value})} rows={10} className="w-full px-4 py-2 border rounded-xl"/>
              </div>
            </div>
            <Imgs
              images={aboutImages}
              setImages={async (imgs) => {
                setAboutImages(imgs)
                await db.updateSiteImages('about', imgs)
              }}
              label="About Page Carousel Images"
            />
            <button onClick={async()=>{
              try {
                await db.updateCompany(company)
                show('About page text & carousel saved!')
              } catch(e) { show('Save failed', true) }
            }} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save About Page</button>
          </div>
        </div>}

        {/* SERVICES TAB */}
        {tab==='services'&&<div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add Service'}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Title" value={editingService?.title || newService.title} onChange={e=>editingService ? setEditingService({...editingService,title:e.target.value}) : setNewService({...newService,title:e.target.value})} className="px-4 py-2 border rounded-xl"/>
              <select value={editingService?.category || newService.category} onChange={e=>editingService ? setEditingService({...editingService,category:e.target.value}) : setNewService({...newService,category:e.target.value})} className="px-4 py-2 border rounded-xl">
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <textarea placeholder="Description" value={editingService?.description || newService.description} onChange={e=>editingService ? setEditingService({...editingService,description:e.target.value}) : setNewService({...newService,description:e.target.value})} className="px-4 py-2 border rounded-xl md:col-span-2" rows={2}/>
            </div>
            <Imgs images={editingService?.images || newService.images} setImages={imgs=>editingService ? setEditingService({...editingService,images:imgs}) : setNewService({...newService,images:imgs})} label="Service Carousel Images"/>
            <div className="flex gap-3 mt-4">
              {editingService ? (
                <>
                  <button onClick={async()=>{
                    try {
                      await db.updateService(editingService.id, editingService)
                      loadAll()
                      setEditingService(null)
                      show('Service updated!')
                    } catch(e) { show('Failed', true) }
                  }} className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save</button>
                  <button onClick={()=>setEditingService(null)} className="bg-slate-200 px-6 py-2 rounded-xl">Cancel</button>
                </>
              ) : (
                <button onClick={async()=>{
                  if(!newService.title) return show('Title required',true)
                  try{
                    await db.addService(newService)
                    loadAll()
                    setNewService({title:'',description:'',category:'general',images:[]})
                    show('Added!')
                  }catch(e){show('Failed',true)}
                }} className="bg-amber-500 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Plus className="w-4 h-4"/>Add</button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Services ({services.length})</h2>
            {services.length === 0 ? <p className="text-slate-500 text-center py-8">No services yet – add one above!</p> : (
              <div className="space-y-4">
                {services.map(s => (
                  <div key={s.id} className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                    <img src={s.images?.[0]||''} alt="" className="w-20 h-16 object-cover rounded-lg bg-slate-200"/>
                    <div className="flex-1">
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-slate-500 text-sm">{s.description?.substring(0,50)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>setEditingService(s)} className="text-blue-600"><Edit2 className="w-5 h-5"/></button>
                      <button onClick={async()=>{await db.updateService(s.id,{active:!s.active});loadAll()}} className={`px-3 py-1 rounded text-sm ${s.active?'bg-green-100 text-green-700':'bg-slate-200'}`}>{s.active?'Active':'Hidden'}</button>
                      <button onClick={async()=>{if(confirm('Delete?')){await db.deleteService(s.id);loadAll()}}} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>}

        {/* GALLERY TAB */}
        {tab==='gallery'&&<div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingGallery ? 'Edit Project' : 'Add Project'}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Title" value={editingGallery?.title || newGallery.title} onChange={e=>editingGallery ? setEditingGallery({...editingGallery,title:e.target.value}) : setNewGallery({...newGallery,title:e.target.value})} className="px-4 py-2 border rounded-xl"/>
              <select value={editingGallery?.category || newGallery.category} onChange={e=>editingGallery ? setEditingGallery({...editingGallery,category:e.target.value}) : setNewGallery({...newGallery,category:e.target.value})} className="px-4 py-2 border rounded-xl">
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <Imgs images={editingGallery?.images || newGallery.images} setImages={imgs=>editingGallery ? setEditingGallery({...editingGallery,images:imgs}) : setNewGallery({...newGallery,images:imgs})} label="Project Carousel Images"/>
            <div className="flex gap-3 mt-4">
              {editingGallery ? (
                <>
                  <button onClick={async()=>{
                    try {
                      await db.updateGalleryItem(editingGallery.id, editingGallery)
                      loadAll()
                      setEditingGallery(null)
                      show('Project updated!')
                    } catch(e) { show('Failed', true) }
                  }} className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save</button>
                  <button onClick={()=>setEditingGallery(null)} className="bg-slate-200 px-6 py-2 rounded-xl">Cancel</button>
                </>
              ) : (
                <button onClick={async()=>{
                  if(!newGallery.title || !newGallery.images.length) return show('Title & images required',true)
                  try{
                    await db.addGalleryItem(newGallery)
                    loadAll()
                    setNewGallery({title:'',category:'general',images:[]})
                    show('Added!')
                  }catch(e){show('Failed',true)}
                }} className="bg-amber-500 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Plus className="w-4 h-4"/>Add</button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Gallery ({gallery.length})</h2>
            {gallery.length === 0 ? <p className="text-slate-500 text-center py-8">No projects yet – add one above!</p> : (
              <div className="grid md:grid-cols-3 gap-4">
                {gallery.map(g => (
                  <div key={g.id} className="bg-slate-50 rounded-xl overflow-hidden">
                    <img src={g.images?.[0]||''} alt="" className="w-full h-32 object-cover"/>
                    <div className="p-3">
                      <p className="font-semibold">{g.title}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={()=>setEditingGallery(g)} className="text-blue-600 text-sm">Edit</button>
                        <button onClick={async()=>{if(confirm('Delete?')){await db.deleteGalleryItem(g.id);loadAll()}}} className="text-red-500 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>}

        {/* BEFORE & AFTER TAB */}
        {tab==='beforeafter'&&<div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingBeforeAfter ? 'Edit Before & After' : 'Add Before & After Project'}</h2>
            <div className="space-y-4 mb-6">
              <input placeholder="Title" value={editingBeforeAfter?.title || newBeforeAfter.title} onChange={e=>editingBeforeAfter ? setEditingBeforeAfter({...editingBeforeAfter,title:e.target.value}) : setNewBeforeAfter({...newBeforeAfter,title:e.target.value})} className="w-full px-4 py-2 border rounded-xl"/>
              <textarea placeholder="Description (optional)" value={editingBeforeAfter?.description || newBeforeAfter.description} onChange={e=>editingBeforeAfter ? setEditingBeforeAfter({...editingBeforeAfter,description:e.target.value}) : setNewBeforeAfter({...newBeforeAfter,description:e.target.value})} rows={4} className="w-full px-4 py-2 border rounded-xl"/>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-2">Before Images (multiple allowed)</label>
                <Imgs images={editingBeforeAfter?.before_images || newBeforeAfter.before_images} setImages={imgs=>editingBeforeAfter ? setEditingBeforeAfter({...editingBeforeAfter,before_images:imgs}) : setNewBeforeAfter({...newBeforeAfter,before_images:imgs})} label="Before Images"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">After Images (multiple allowed)</label>
                <Imgs images={editingBeforeAfter?.after_images || newBeforeAfter.after_images} setImages={imgs=>editingBeforeAfter ? setEditingBeforeAfter({...editingBeforeAfter,after_images:imgs}) : setNewBeforeAfter({...newBeforeAfter,after_images:imgs})} label="After Images"/>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {editingBeforeAfter ? (
                <>
                  <button onClick={async()=>{
                    try {
                      await db.updateBeforeAfter(editingBeforeAfter.id, editingBeforeAfter)
                      loadAll()
                      setEditingBeforeAfter(null)
                      show('Updated!')
                    } catch(e) { show('Failed', true) }
                  }} className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4"/>Save</button>
                  <button onClick={()=>setEditingBeforeAfter(null)} className="bg-slate-200 px-6 py-2 rounded-xl">Cancel</button>
                </>
              ) : (
                <button onClick={async()=>{
                  if(!newBeforeAfter.title || newBeforeAfter.before_images.length === 0 || newBeforeAfter.after_images.length === 0) return show('Title & at least one before/after image required',true)
                  try{
                    await db.addBeforeAfter(newBeforeAfter)
                    loadAll()
                    setNewBeforeAfter({title:'',description:'',before_images:[],after_images:[]})
                    show('Added!')
                  }catch(e){show('Failed',true)}
                }} className="bg-amber-500 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Plus className="w-4 h-4"/>Add Project</button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Before & After Projects ({beforeAfter.length})</h2>
            {beforeAfter.length === 0 ? <p className="text-slate-500 text-center py-8">No before & after projects yet – add one above!</p> : (
              <div className="grid md:grid-cols-2 gap-8">
                {beforeAfter.map(p => (
                  <div key={p.id} className="bg-slate-50 rounded-xl overflow-hidden shadow-lg">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <img src={p.before_images?.[0]||''} alt="Before" className="w-full h-64 object-cover"/>
                        <div className="absolute bottom-0 left-0 bg-black/70 text-white px-4 py-2">{p.before_images?.length || 0} Before</div>
                      </div>
                      <div className="relative">
                        <img src={p.after_images?.[0]||''} alt="After" className="w-full h-64 object-cover"/>
                        <div className="absolute bottom-0 left-0 bg-amber-600 text-white px-4 py-2">{p.after_images?.length || 0} After</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                      <p className="text-slate-600">{p.description}</p>
                      <div className="flex gap-3 mt-4">
                        <button onClick={()=>setEditingBeforeAfter(p)} className="text-blue-600"><Edit2 className="w-5 h-5"/></button>
                        <button onClick={async()=>{if(confirm('Delete?')){await db.deleteBeforeAfter(p.id);loadAll()}}} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>}

        {/* REVIEWS TAB */}
        {tab==='reviews'&&<div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Reviews ({reviews.filter(r=>!r.approved).length} pending)</h2>
          {reviews.length === 0 ? <p className="text-slate-500 text-center py-8">No reviews yet</p> : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className={`p-4 rounded-xl border ${r.approved?'bg-green-50 border-green-200':'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{r.name}</span>
                        <span className="text-slate-500">• {r.location}</span>
                        <Stars rating={r.rating} size="small"/>
                      </div>
                      <p className="text-slate-600">{r.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={async()=>{await db.updateReview(r.id,{approved:!r.approved});loadAll()}} className={`px-3 py-1 rounded-full text-xs font-medium ${r.approved?'bg-green-600 text-white':'bg-yellow-500 text-white'}`}>
                        {r.approved?'Approved':'Pending'}
                      </button>
                      <button onClick={async()=>{if(confirm('Delete?')){await db.deleteReview(r.id);loadAll()}}} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>}

        {/* MESSAGES TAB – with reply & delete */}
        {tab==='messages'&&<div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Messages ({contacts.filter(c=>!c.read).length} unread)</h2>
          {contacts.length === 0 ? <p className="text-slate-500 text-center py-8">No messages yet</p> : (
            <div className="space-y-6">
              {contacts.map(c => (
                <div key={c.id} className={`p-6 rounded-xl border ${c.read ? 'bg-slate-50' : 'bg-blue-50 border-blue-300'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg">{c.name}</p>
                      <p className="text-slate-600">{c.email}{c.phone && ` • ${c.phone}`}</p>
                      <p className="text-slate-500 text-sm mt-1">{new Date(c.created_at).toLocaleString()}</p>
                    </div>
                    {!c.read && (
                      <button onClick={async() => { await db.markContactRead(c.id); loadAll() }} className="text-blue-600 font-medium hover:underline">
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap mb-6">{c.message}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setReplyingTo(c)
                        setReplySubject(`Re: Your inquiry`)
                        setReplyMessage('')
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium"
                    >
                      Reply
                    </button>
                    <a href={`mailto:${c.email}?subject=Re: Your inquiry`} className="text-green-600 font-medium hover:underline">
                      Reply via email app
                    </a>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this message permanently?')) {
                          try {
                            await db.deleteContactSubmission(c.id)
                            loadAll()
                            show('Message deleted!')
                          } catch (e) {
                            show('Delete failed', true)
                          }
                        }
                      }}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Modal */}
          {replyingTo && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6">Reply to {replyingTo.name}</h3>
                <p className="text-slate-600 mb-4">To: {replyingTo.email}</p>
                <input
                  type="text"
                  value={replySubject}
                  onChange={e => setReplySubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full px-4 py-3 border rounded-xl mb-4"
                />
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Your reply..."
                  rows={10}
                  className="w-full px-4 py-3 border rounded-xl mb-6"
                />
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/reply-contact', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            to: replyingTo.email,
                            subject: replySubject,
                            message: replyMessage,
                            name: replyingTo.name
                          })
                        })
                        if (!res.ok) throw new Error()
                        show('Reply sent!')
                        setReplyingTo(null)
                      } catch (e) { show('Send failed', true) }
                    }}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700"
                  >
                    Send Reply
                  </button>
                  <button onClick={() => setReplyingTo(null)} className="bg-slate-200 px-8 py-3 rounded-xl font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>}
      </div>

      {msg && <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${msg.err?'bg-red-500':'bg-green-500'} text-white`}>{msg.m}</div>}
    </div>
  )
}