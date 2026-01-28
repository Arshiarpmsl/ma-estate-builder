import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Phone, Menu, X, HardHat } from 'lucide-react'

export default function Header({ company }) {
  const [menu, setMenu] = useState(false)
  const router = useRouter()
  const Nav = ({ href, children }) => <Link href={href} className={`px-4 py-2 font-medium ${router.pathname === href ? 'text-amber-500' : 'text-slate-700 hover:text-amber-600'}`} onClick={() => setMenu(false)}>{children}</Link>

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="MA Estate Builder" className="h-12 w-auto"/>

          <div><h1 className="text-xl font-bold text-slate-800">MA Estate Builder</h1><p className="text-xs text-slate-500">Ltd</p></div>
        </Link>
        <nav className="hidden md:flex items-center gap-1"><Nav href="/">Home</Nav><Nav href="/services">Services</Nav><Nav href="/before-after">Before & After</Nav><Nav href="/gallery">Gallery</Nav><Nav href="/about">About</Nav><Nav href="/reviews">Reviews</Nav><Nav href="/contact">Contact</Nav></nav>
        <div className="hidden md:flex items-center gap-4">
          <a href={`tel:${company?.phone}`} className="flex items-center gap-2 text-slate-700"><Phone className="w-4 h-4"/>{company?.phone}</a>
          <Link href="/contact" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full font-medium">Free Quote</Link>
        </div>
        <button onClick={() => setMenu(!menu)} className="md:hidden p-2">{menu ? <X/> : <Menu/>}</button>
      </div>
      {menu && <div className="md:hidden py-4 border-t flex flex-col"><Nav href="/">Home</Nav><Nav href="/services">Services</Nav><Nav href="/before-after">Before & After</Nav><Nav href="/gallery">Gallery</Nav><Nav href="/about">About</Nav><Nav href="/reviews">Reviews</Nav><Nav href="/contact">Contact</Nav></div>}
    </header>
  )
}
