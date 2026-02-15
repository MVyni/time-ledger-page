import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 rounded-xl font-semibold
      transition-all duration-200 outline-none
      focus-visible:ring-2 focus-visible:ring-blue-500/25
      disabled:cursor-not-allowed disabled:opacity-60
      active:scale-[0.98]
    `

    const variants = {
      primary: `
        bg-blue-600 text-white
        shadow-lg shadow-blue-600/20
        hover:bg-blue-500
      `,
      secondary: `
        border border-slate-700 bg-slate-800/60 text-slate-200
        hover:bg-slate-800 hover:border-slate-600
      `,
      ghost: `
        text-slate-300
        hover:bg-slate-800/70 hover:text-slate-100
      `,
    }

    const sizes = {
      sm: 'h-9 px-3.5 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
