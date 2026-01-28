import { Star } from 'lucide-react'

export default function Stars({ rating, onClick, size = 'normal' }) {
  const s = size === 'small' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} onClick={() => onClick && onClick(i)} className={`${s} ${onClick ? 'cursor-pointer' : ''} ${i <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
      ))}
    </div>
  )
}