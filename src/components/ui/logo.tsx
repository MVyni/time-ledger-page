import { Clock } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light'
}

const sizes = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-2xl' },
  lg: { icon: 36, text: 'text-3xl' },
}

export function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  const s = sizes[size]
  const isLight = variant === 'light'
  
  const iconColor = isLight ? 'text-white' : 'text-primary-600'
  const textColor = isLight ? 'text-white' : 'text-surface-900'
  const accentColor = isLight ? 'text-primary-200' : 'text-primary-600'

  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center`}>
        <div className={`absolute inset-0 rounded-full blur-lg opacity-50 ${isLight ? 'bg-primary-400' : 'bg-primary-200'}`} />
        <Clock 
          size={s.icon} 
          className={`${iconColor} relative z-10`} 
          strokeWidth={2.5} 
        />
      </div>
      <div>
        <h1 className={`${s.text} font-bold tracking-tight ${textColor}`}>
          Time<span className={accentColor}>Ledger</span>
        </h1>
      </div>
    </div>
  )
}
