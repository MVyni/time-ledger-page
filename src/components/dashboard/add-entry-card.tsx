import { useState } from 'react'
import { Plus, CalendarDays, Clock, EuroIcon } from 'lucide-react'

interface AddEntryCardProps {
  onAdd: (date: string, durationMinutes: number, ratePerHour: number) => void
}

export function AddEntryCard({ onAdd }: AddEntryCardProps) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [hours, setHours] = useState('')
  const [rate, setRate] = useState('')
  const [error, setError] = useState('')

  function parseHoursToMinutes(raw: string): number {
    const value = raw.trim()
    if (!value) return NaN

    // Prefer HH:MM (or H:MM). Also accept plain H.
    if (value.includes(':')) {
      const match = /^(\d{1,2}):(\d{2})$/.exec(value)
      if (!match) return NaN

      const h = Number(match[1])
      const m = Number(match[2])
      if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN
      if (h < 0 || h > 24) return NaN
      if (m < 0 || m > 59) return NaN
      if (h === 24 && m !== 0) return NaN

      return h * 60 + m
    }

    // Backward compatible: accept decimals like 9.5 or 9,5
    const normalized = value.replace(',', '.')
    const hoursDecimal = Number(normalized)
    if (!Number.isFinite(hoursDecimal)) return NaN

    return Math.round(hoursDecimal * 60)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const durationMinutes = parseHoursToMinutes(hours)
    const rateNum = parseFloat(rate)

    if (!date) {
      setError('Selecione uma data.')
      return
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 24 * 60) {
      setError('Informe as horas no formato HH:MM (ex: 9:00).')
      return
    }

    if (isNaN(rateNum) || rateNum <= 0) {
      setError('Informe um valor/hora válido.')
      return
    }

    try {
      onAdd(date, durationMinutes, rateNum)
      setHours('')
      setRate('')
      setError('')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20 flex flex-col gap-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
          <Plus size={18} className="text-blue-400" />
        </div>
        <h2 className="text-sm font-semibold text-slate-200">Adicionar Dia</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Data
            </span>
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Hours */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Horas
              </span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ex: 9:00"
              value={hours}
              onChange={e => setHours(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-400">
              <span className="flex items-center gap-1.5">
                <EuroIcon size={14} />
                Valor/Hora
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Ex: 50.00"
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-red-400 animate-fade-in">{error}</p>
        )}

        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98]"
        >
          <Plus size={18} />
          Adicionar
        </button>
      </form>
    </div>
  )
}
