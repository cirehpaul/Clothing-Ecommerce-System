import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  showNumber?: boolean
  count?: number
  className?: string
}

export default function StarRating({ rating, max = 5, size = 14, showNumber, count, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < Math.floor(rating)
          const half = !filled && i < rating
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'star-filled' : 'star-empty'}
              fill={filled ? 'currentColor' : 'none'}
              style={{ opacity: half ? 0.5 : 1 }}
            />
          )
        })}
      </div>
      {showNumber && (
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {rating.toFixed(1)}{count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  )
}
