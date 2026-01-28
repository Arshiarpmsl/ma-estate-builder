import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Image, ZoomIn } from 'lucide-react'

export default function ImageCarousel({ images, height = "h-48", autoPlay = false, onImageClick }) {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)
  const touchStartTime = useRef(null)

  const SWIPE_THRESHOLD = 50
  const MAX_TAP_TIME = 300

  useEffect(() => {
    if (autoPlay && !hovered && images?.length > 1) {
      const t = setInterval(() => setCurrent(c => (c + 1) % images.length), 4000)
      return () => clearInterval(t)
    }
  }, [autoPlay, hovered, images?.length])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
    touchEndX.current = null
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const time = Date.now() - touchStartTime.current
    const isSwipe = Math.abs(distance) > SWIPE_THRESHOLD

    if (isSwipe) {
      if (distance > 0) {
        setCurrent(c => (c + 1) % images.length) // Swipe left → next
      } else {
        setCurrent(c => (c - 1 + images.length) % images.length) // Swipe right → prev
      }
    } else {
      // Not a swipe → treat as tap: open lightbox
      onImageClick && onImageClick(images, current)
    }

    touchStartX.current = null
    touchEndX.current = null
    touchStartTime.current = null
  }

  const handleClick = () => {
    // Desktop click → open lightbox on current image
    onImageClick && onImageClick(images, current)
  }

  if (!images || images.length === 0) return <div className={`${height} bg-slate-200 flex items-center justify-center`}><Image className="w-12 h-12 text-slate-400"/></div>
  if (images.length === 1) return (
    <div className={`relative ${height} cursor-pointer`} onClick={() => onImageClick && onImageClick(images, 0)}>
      <img src={images[0]} alt="" className={`w-full ${height} object-cover`} />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
        <ZoomIn className="w-12 h-12 text-white"/>
      </div>
    </div>
  )

  return (
    <div
      className={`relative ${height} group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick} // Desktop click opens lightbox
    >
      <div className="absolute inset-0 overflow-hidden">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      {/* Zoom icon overlay – shows on hover (desktop) or always faint on mobile */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
        <ZoomIn className="w-12 h-12 text-white"/>
      </div>

      {/* Arrows – always visible on mobile, hover on desktop, larger for touch */}
      <button
        onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length) }}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center z-20 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-7 h-7"/>
      </button>
      <button
        onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length) }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center z-20 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-7 h-7"/>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setCurrent(i) }}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/70'}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full z-20">
        {current + 1}/{images.length}
      </div>
    </div>
  )
}