import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
}

const styles = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  info: 'border-blue-500/30',
}

const iconStyles = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
}

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type]

  return (
    <div
      className={`
        ios-no-backdrop fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2
        flex items-center gap-3 rounded-2xl border px-4 py-3
        bg-slate-900 text-slate-100 shadow-lg shadow-black/30 backdrop-blur
        animate-slide-up
        ${styles[type]}
      `}
    >
      <Icon size={20} className={iconStyles[type]} />
      <p className="text-sm font-medium flex-1 text-slate-100">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-300 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  )
}
