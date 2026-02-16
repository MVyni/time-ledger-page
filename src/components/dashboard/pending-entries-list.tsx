import { useMemo, useState } from 'react'
import { Pencil, Trash2, Check, X, CalendarDays, Clock, EuroIcon } from 'lucide-react'
import type { WorkEntry } from '@/types'

interface PendingEntriesListProps {
  entries: WorkEntry[]
  onDelete: (id: string) => void | Promise<void>
  onEdit: (id: string, data: { date: string; durationMinutes: number; hourlyRate: number }) => void
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function parseHoursToMinutes(raw: string): number {
  const value = raw.trim()
  if (!value) return NaN

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

function formatCurrency(value: number): string {
  return `€${value.toFixed(2)}`
}

export function PendingEntriesList({ entries, onDelete, onEdit }: PendingEntriesListProps) {
  const sorted = useMemo(
    () => entries.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [entries],
  )

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editHours, setEditHours] = useState('')
  const [editRate, setEditRate] = useState('')
  const [error, setError] = useState('')

  function startEdit(entry: WorkEntry) {
    const date = new Date(entry.date)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    setEditingId(entry.id)
    setError('')
    setEditDate(`${yyyy}-${mm}-${dd}`)
    setEditHours(formatTime(entry.durationMinutes))
    setEditRate(String(entry.hourlyRate))
  }

  function cancelEdit() {
    setEditingId(null)
    setError('')
    setEditDate('')
    setEditHours('')
    setEditRate('')
  }

  function submitEdit() {
    setError('')

    const durationMinutes = parseHoursToMinutes(editHours)
    const rateNum = Number(editRate)

    if (!editDate) {
      setError('Selecione uma data.')
      return
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 24 * 60) {
      setError('Horas inválidas. Use HH:MM (ex: 9:00).')
      return
    }

    if (!Number.isFinite(rateNum) || rateNum <= 0) {
      setError('Informe um valor/hora válido.')
      return
    }

    if (!editingId) return
    onEdit(editingId, {
      date: editDate,
      durationMinutes,
      hourlyRate: rateNum,
    })
    cancelEdit()
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 !p-2 flex flex-col">
      <div className="!mb-4 border-b border-slate-800/60 pb-6">
        <h3 className="text-sm font-semibold text-slate-200">Registros Pendentes</h3>
        <p className="mt-0.5 text-xs text-slate-500">Edite ou remova antes de salvar</p>
      </div>

      <ul className="flex flex-col gap-y-4">
        {sorted.map(entry => {
          const subtotal = (entry.durationMinutes / 60) * entry.hourlyRate
          const isEditing = editingId === entry.id

          return (
            <li key={entry.id} className="py-6">
              {!isEditing ? (
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{formatDate(entry.date)}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{formatTime(entry.durationMinutes)}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-100">{formatCurrency(subtotal)}</p>
                        <p className="mt-0.5 text-xs text-slate-500">€{entry.hourlyRate.toFixed(2)}/h</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-auto flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(entry)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Deletar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          Data
                        </span>
                      </label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [color-scheme:dark]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          Horas (HH:MM)
                        </span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editHours}
                        onChange={e => setEditHours(e.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                        value={editRate}
                        onChange={e => setEditRate(e.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        onClick={submitEdit}
                        className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98]"
                      >
                        <Check size={18} />
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700"
                        title="Cancelar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs font-medium text-red-400 animate-fade-in">{error}</p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
