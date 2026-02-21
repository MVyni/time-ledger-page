import { ChevronRight, Clock, EuroIcon, Trash2 } from 'lucide-react'
import type { MonthlyHistory } from '@/types'

interface MonthCardProps {
  data: MonthlyHistory
  onClick: () => void
  onDelete: () => void | Promise<void>
  isDeleting?: boolean
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function getMonthLabel(month: number, year: number): string {
  const date = new Date(year, month - 1)
  const monthLabel = date.toLocaleDateString('pt-BR', { month: 'long' })
  return `${monthLabel} / ${year}`
}

export function MonthCard({ data, onClick, onDelete, isDeleting = false }: MonthCardProps) {
  return (
    <div className="group relative w-full rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700 hover:bg-slate-800/60">
      <button
        type="button"
        onClick={onClick}
        className="w-full !p-2 text-left active:scale-[0.99]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold capitalize text-slate-200">
            {getMonthLabel(data.month, data.year)}
          </h3>
          <ChevronRight size={20} className="text-slate-500 transition-transform group-hover:translate-x-1" />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-400">
              {formatTime(data.totalMinutes)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <EuroIcon size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-emerald-400">
              {data.totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="absolute right-12 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
        title="Excluir histórico do mês"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
