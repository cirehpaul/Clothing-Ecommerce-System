import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className, iconOnly }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 group select-none", className)}>
      <div 
        className="w-8 h-8 rounded-full border flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105 shrink-0"
        style={{ 
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
          borderColor: 'rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.4)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay" 
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)' }}
        ></div>
        <span 
          className="font-serif italic font-black text-[15px] leading-none relative z-10"
          style={{ 
            background: 'linear-gradient(to bottom, #ffffff 0%, #9ca3af 45%, #f3f4f6 55%, #6b7280 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))',
            letterSpacing: '-1px',
            paddingRight: '2px',
          }}
        >
          TS
        </span>
      </div>
      
      {!iconOnly && (
        <span 
          className="font-serif text-xl tracking-[0.25em] ml-1 uppercase relative"
          style={{ 
            background: 'linear-gradient(to bottom, var(--text-primary) 0%, color-mix(in srgb, var(--text-primary) 60%, transparent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TIMELESS
        </span>
      )}
    </div>
  )
}
