import { type InputHTMLAttributes, forwardRef, useId, useState } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { InputGroup } from './input-group'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: LucideIcon
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon: Icon, type, className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const reactId = useId()
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const inputId = id ?? props.name ?? reactId

    return (
      <InputGroup label={label} htmlFor={inputId} error={error} hint={hint} icon={Icon}>
        <div
          className={`
            group flex w-full items-stretch rounded-xl border bg-slate-800/60
            transition-all duration-200
            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20
            disabled:cursor-not-allowed
            ${error
              ? 'border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/20'
              : 'border-slate-700 hover:border-slate-600'
            }
          `}
        >
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`
              w-full flex-1 bg-transparent px-4 py-3.5 text-sm text-slate-100 outline-none
              placeholder:text-slate-500
              disabled:text-slate-500
              ${isPassword ? '!pr-0' : ''}
              ${className}
            `}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center px-4 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </InputGroup>
    )
  }
)

Input.displayName = 'Input'
