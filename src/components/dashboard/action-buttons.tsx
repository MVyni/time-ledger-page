import { MessageCircle, Save, Loader2, Lock } from 'lucide-react'
import type { WorkEntry } from '@/types'

interface ActionButtonsProps {
  entries: WorkEntry[]
  totalMinutes: number
  monthLabel: string
  userName?: string | null
  isAuthenticated: boolean
  isSaving: boolean
  unsavedCount: number
  onSave: () => void
  onAuthRequired: () => void
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function buildWhatsAppMessage(
  entries: WorkEntry[],
  totalMinutes: number,
  monthLabel: string,
  userName?: string | null,
): string {
  const safeUserName = userName?.trim() ? userName.trim() : 'Usuário'
  const header = `*Time Ledger — ${safeUserName}*\n${monthLabel}\n\n`

  const lines = entries.map(entry => {
    const date = new Date(entry.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
    return `${date}: ${formatTime(entry.durationMinutes)}`
  })

  const body = lines.join('\n')

  const footer = `\n\nTOTAL DO MÊS:\nHoras: ${formatTime(totalMinutes)}`

  return header + body + footer
}

export function ActionButtons({
  entries,
  totalMinutes,
  monthLabel,
  userName,
  isAuthenticated,
  isSaving,
  unsavedCount,
  onSave,
  onAuthRequired,
}: ActionButtonsProps) {
  function handleWhatsApp() {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }

    if (entries.length === 0) return

    const message = buildWhatsAppMessage(entries, totalMinutes, monthLabel, userName)
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  function handleSave() {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onSave()
  }

  return (
    <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
      {/* WhatsApp */}
      <button
        type="button"
        onClick={handleWhatsApp}
        disabled={entries.length === 0}
        className="flex !h-14 !min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 md:flex-1"
      >
        {!isAuthenticated && <Lock size={15} />}
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || (isAuthenticated && unsavedCount === 0)}
        className="flex !h-14 !min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 md:flex-1"
      >
        {isSaving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            {!isAuthenticated && <Lock size={15} />}
            <Save size={18} />
          </>
        )}
        <span>
          {isSaving
            ? 'Salvando...'
            : unsavedCount > 0
              ? `Salvar (${unsavedCount})`
              : 'Salvar'}
        </span>
      </button>
    </div>
  )
}
