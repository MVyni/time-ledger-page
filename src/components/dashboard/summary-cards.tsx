import { Clock, Coins } from 'lucide-react'

interface SummaryCardsProps {
  totalMinutes: number
  totalEarnings: number
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function SummaryCards({ totalMinutes, totalEarnings }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Horas Totais */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col items-center gap-2">
        <Clock size={22} className="text-slate-400" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Horas Totais
        </span>
        <span className="text-2xl md:text-3xl font-bold text-slate-100">
          {formatHHMM(totalMinutes)}
        </span>
      </div>

      {/* Total a Receber */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col items-center gap-2">
        <Coins size={22} className="text-emerald-400" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Total a Receber
        </span>
        <span className="text-2xl md:text-3xl font-bold text-emerald-400">
          €{totalEarnings.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
