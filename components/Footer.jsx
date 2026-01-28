import Link from 'next/link'
import { Phone, Mail, MapPin, HardHat, CheckCircle, ExternalLink } from 'lucide-react'

export default function Footer({ company }) {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4"><img src="/logo.svg" alt="MA Estate Builder" className="h-12 w-auto"/><h3 className="text-xl font-bold">{company?.name || 'MA Estate Builder Ltd'}</h3></div>
          <p className="text-slate-400 mb-6">{company?.tagline}</p>
          <a href={company?.checkatrade_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"><CheckCircle className="w-5 h-5"/>Checkatrade<ExternalLink className="w-4 h-4"/></a>
        </div>
        <div><h4 className="font-semibold mb-4">Links</h4>{['Home','Services','Gallery','About','Reviews','Contact'].map(l=><Link key={l} href={l==='Home'?'/':`/${l.toLowerCase()}`} className="block text-slate-400 hover:text-amber-500 mb-2">{l}</Link>)}</div>
        <div><h4 className="font-semibold mb-4">Contact</h4><p className="text-slate-400 mb-2"><Phone className="w-4 h-4 inline mr-2"/>{company?.phone}</p><p className="text-slate-400 mb-2"><Mail className="w-4 h-4 inline mr-2"/>{company?.email}</p><p className="text-slate-400"><MapPin className="w-4 h-4 inline mr-2"/>{company?.address}</p></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 mt-12 pt-8 flex justify-between"><p className="text-slate-500">© 2025 {company?.name || 'MA Estate Builder Ltd'}</p></div>
    </footer>
  )
}
