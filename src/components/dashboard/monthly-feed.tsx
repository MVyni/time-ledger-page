import { Trash2, ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, Clock } from 'lucide-react'
import type { WorkEntry } from '@/types'

interface MonthlyFeedProps {
  entries: WorkEntry[]
  monthLabel: string
  isLoading: boolean
  onRemove: (id: string) => void
  onPreviousMonth?: () => void
  onNextMonth?: () => void
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const mm = String(m).padStart(2, '0')
  return `${h}:${mm}`
}

function formatCurrency(value: number): string {
  return `€${value.toFixed(2)}`
}

export function MonthlyFeed({
  entries,
  monthLabel,
  isLoading,
  onRemove,
  onPreviousMonth,
  onNextMonth,
}: MonthlyFeedProps) {
  return (
    <div className="space-y-3">
      {/* Month navigation - hide if no handlers */}
      {(onPreviousMonth || onNextMonth) && (
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={onPreviousMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            disabled={!onPreviousMonth}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-sm font-semibold capitalize text-slate-300">
            {monthLabel}
          </h3>
          <button
            type="button"
            onClick={onNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            disabled={!onNextMonth}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Entry list */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <CalendarDays size={32} className="mb-3 text-slate-600" />
            <p className="text-sm font-medium">Nenhum registro neste mês</p>
            <p className="text-xs text-slate-600 mt-1">Adicione seu primeiro dia acima</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800/60">
            {entries.map((entry, index) => {
              const hours = entry.durationMinutes / 60
              const subtotal = hours * entry.hourlyRate

              return (
                <li
                  key={entry.id}
                  className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-800/40 animate-fade-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0">
                    {entry.saved ? (
                      <CheckCircle2 size={16} className="text-emerald-500/70" />
                    ) : (
                      <Clock size={16} className="text-amber-400/70" />
                    )}
                  </div>

                  {/* Date */}
                  <span className="min-w-[52px] text-sm font-medium text-slate-300">
                    {formatDate(entry.date)}
                  </span>

                  {/* Hours */}
                  <span className="min-w-[44px] text-sm text-slate-400">
                    {formatHours(entry.durationMinutes)}
                  </span>

                  {/* Subtotal - pushed to the right */}
                  <span className="ml-auto text-sm font-semibold text-slate-200">
                    {formatCurrency(subtotal)}
                  </span>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onRemove(entry.id)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                    title="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
