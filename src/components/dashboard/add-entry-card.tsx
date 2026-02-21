import { useMemo, useState } from 'react'
import { Plus, CalendarDays, Clock, EuroIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface AddEntryCardProps {
  onAdd: (dates: string | string[], durationMinutes: number, ratePerHour: number) => void
}

function formatYmd(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function makeYmd(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function AddEntryCard({ onAdd }: AddEntryCardProps) {
  const today = formatYmd(new Date())
  const [date, setDate] = useState(today)
  const [hours, setHours] = useState('')
  const [rate, setRate] = useState('')
  const [error, setError] = useState('')

  const [multiMode, setMultiMode] = useState(false)
  const initialView = useMemo(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  }, [])
  const [viewYear, setViewYear] = useState(initialView.year)
  const [viewMonth, setViewMonth] = useState(initialView.month) // 0-11
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates])

  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1)
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }, [viewYear, viewMonth])

  const calendarCells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const startWeekday = first.getDay() // 0=Dom
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    return Array.from({ length: 42 }, (_, i) => {
      const day = i - startWeekday + 1
      if (day < 1 || day > daysInMonth) return null
      return day
    })
  }, [viewYear, viewMonth])

  function toggleSelected(ymd: string) {
    setSelectedDates(prev => {
      const set = new Set(prev)
      if (set.has(ymd)) set.delete(ymd)
      else set.add(ymd)
      return Array.from(set)
    })
  }

  function goPrevMonth() {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1)
        return 11
      }
      return prev - 1
    })
  }

  function goNextMonth() {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1)
        return 0
      }
      return prev + 1
    })
  }

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

    if (!multiMode && !date) {
      setError('Selecione uma data.')
      return
    }

    if (multiMode && selectedDates.length === 0) {
      setError('Selecione pelo menos um dia no calendário.')
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
      const datesToAdd = multiMode ? selectedDates.slice().sort() : date
      onAdd(datesToAdd, durationMinutes, rateNum)
      setHours('')
      setRate('')
      setError('')

      if (multiMode) {
        setSelectedDates([])
      }
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
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium mb-1.5 text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Data
            </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setMultiMode(v => {
                  const next = !v
                  if (next) {
                    const base = date ? new Date(date) : new Date()
                    setViewYear(base.getFullYear())
                    setViewMonth(base.getMonth())
                    setSelectedDates(prev => (prev.length ? prev : [formatYmd(base)]))
                  }
                  return next
                })
              }}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {multiMode ? 'Selecionar 1 dia' : 'Selecionar vários dias'}
            </button>
          </div>

          {!multiMode ? (
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-base text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [color-scheme:dark]"
            />
          ) : (
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 p-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="min-w-0 text-center">
                  <p className="text-sm font-semibold capitalize text-slate-200">{monthLabel}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Selecionados: {selectedDates.length}
                    {selectedDates.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setSelectedDates([])}
                        className="!ml-4 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Limpar
                      </button>
                    ) : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={goNextMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <div key={d} className="py-1 text-[11px] font-semibold text-slate-500">
                    {d}
                  </div>
                ))}

                {calendarCells.map((day, idx) => {
                  if (!day) return <div key={idx} className="h-9" />
                  const ymd = makeYmd(viewYear, viewMonth, day)
                  const isSelected = selectedSet.has(ymd)
                  return (
                    <button
                      key={ymd}
                      type="button"
                      onClick={() => toggleSelected(ymd)}
                      className={
                        `h-9 rounded-lg text-sm font-semibold transition-colors ` +
                        (isSelected
                          ? 'bg-blue-500/10 text-slate-100 ring-1 ring-blue-500/40'
                          : 'text-slate-300 hover:bg-slate-800')
                      }
                      aria-pressed={isSelected}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
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
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-base text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-base text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
