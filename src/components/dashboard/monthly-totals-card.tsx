import { Clock, EuroIcon, TrendingUp } from 'lucide-react'

interface MonthlyTotalsCardProps {
  totalMinutes: number
  totalEarnings: number
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

export function MonthlyTotalsCard({ totalMinutes, totalEarnings }: MonthlyTotalsCardProps) {
  return (
    <div className="relative rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 p-5 shadow-lg shadow-blue-900/10">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Totais do Mês</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Total Hours */}
          <div className="rounded-xl bg-slate-800/50 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-slate-400">
              <Clock size={14} />
              <span className="text-xs font-medium">Horas Totais</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-50">
              {formatTime(totalMinutes)}
            </p>
          </div>

          {/* Total Earnings */}
          <div className="rounded-xl bg-slate-800/50 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-slate-400">
              <EuroIcon size={14} />
              <span className="text-xs font-medium">Total a Receber</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-emerald-400">
              €{totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
