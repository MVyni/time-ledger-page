import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

interface InputGroupProps {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  icon?: LucideIcon
  children: ReactNode
}

export function InputGroup({ label, htmlFor, hint, error, icon: Icon, children }: InputGroupProps) {
  return (
    <div className="w-full space-y-2.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-semibold text-slate-300"
      >
        {Icon && <Icon size={16} className="text-slate-500" />}
        <span>{label}</span>
      </label>

      {children}

      {error ? (
        <p className="text-xs font-medium text-red-400 animate-fade-in">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}
