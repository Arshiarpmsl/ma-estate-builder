import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    if (currentIndex === null) return
    const h = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNext(); if (e.key === 'ArrowLeft') onPrev() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = 'unset' }
  }, [currentIndex, onClose, onNext, onPrev])

  if (currentIndex === null || !images?.length) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-amber-500 z-50"><X className="w-8 h-8"/></button>
      <button onClick={e => { e.stopPropagation(); onPrev() }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"><ChevronLeft className="w-8 h-8"/></button>
      <button onClick={e => { e.stopPropagation(); onNext() }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"><ChevronRight className="w-8 h-8"/></button>
      <img src={images[currentIndex]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()}/>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">{currentIndex + 1} / {images.length}</div>
    </div>
  )
}