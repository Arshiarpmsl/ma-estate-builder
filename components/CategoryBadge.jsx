export default function CategoryBadge({ category, categories }) {
  const cat = categories?.find(c => c.id === category)
  if (!cat) return null
  return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">{cat.icon} {cat.name}</span>
}