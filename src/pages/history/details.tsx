import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useWorkEntries, useToast } from '@/hooks'
import { ArrowLeft, Lock } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard'
import { SummaryCards, ActionButtons, PendingEntriesList } from '@/components/dashboard'
import { Toast, Button } from '@/components/ui'
import { useMemo } from 'react'

function getMonthBounds(year: number, month: number) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59, 999)
  return { start, end }
}

function getMonthLabel(month: number, year: number): string {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function HistoryDetailsPage() {
  const navigate = useNavigate()
  const { year, month } = useParams<{ year: string; month: string }>()
  const { isAuthenticated, user } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const { allEntries, removeEntry, editEntry, isLoading, isSaving, saveAll } = useWorkEntries()

  const yearNum = Number(year)
  const monthNum = Number(month)

  const entries = useMemo(() => {
    if (!year || !month) return []
    const { start, end } = getMonthBounds(yearNum, monthNum)
    return allEntries
      .filter(e => {
        const d = new Date(e.date)
        return d >= start && d <= end
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [allEntries, yearNum, monthNum])

  const totalMinutes = useMemo(
    () => entries.reduce((sum, e) => sum + e.durationMinutes, 0),
    [entries],
  )

  const totalEarnings = useMemo(
    () =>
      entries.reduce(
        (sum, e) => sum + (e.durationMinutes / 60) * e.hourlyRate,
        0,
      ),
    [entries],
  )

  const unsavedEntries = useMemo(
    () => entries.filter(e => !e.saved),
    [entries],
  )

  const monthLabel = useMemo(() => getMonthLabel(monthNum, yearNum), [monthNum, yearNum])

  async function handleRemoveEntry(id: string) {
    try {
      await removeEntry(id)
      showToast('Registro removido.', 'info')
    } catch {
      showToast('Erro ao remover registro.', 'error')
    }
  }

  async function handleEditEntry(
    id: string,
    data: { date: string; durationMinutes: number; hourlyRate: number },
  ) {
    try {
      await editEntry(id, data)
      showToast('Registro atualizado.', 'success')
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_REQUIRED') {
        showToast('Faça login para editar.', 'error')
        return
      }
      showToast(err instanceof Error ? err.message : 'Erro ao editar registro.', 'error')
      throw err
    }
  }

  async function handleSave() {
    try {
      await saveAll()
      showToast('Registros salvos com sucesso!', 'success')
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_REQUIRED') {
        showToast('Faça login para salvar e exportar.', 'error')
        return
      }
      showToast('Erro ao salvar registros.', 'error')
    }
  }

  function handleAuthRequired() {
    showToast('Faça login para salvar e exportar.', 'error')
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <DashboardHeader />
        <main
          className="w-full flex-1 pt-8 pb-24 flex justify-center"
          style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
        >
          <div className="w-full max-w-3xl px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Lock size={48} className="mb-4 text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-300">Histórico Privado</h2>
              <p className="mt-2 text-sm text-slate-500">
                Faça login para acessar os detalhes do mês.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="mt-6 w-full sm:w-auto"
                size="lg"
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      <DashboardHeader />

      <main
        className="w-full flex-1 pt-8 pb-24 flex justify-center"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
      >
        <div className="w-full max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="!mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold capitalize text-slate-200">{monthLabel}</h1>
              <p className="text-xs text-slate-500">Detalhes do mês</p>
            </div>
          </div>

          {/* Monthly feed */}
          <div className="animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
              </div>
            ) : (
              <PendingEntriesList
                entries={entries}
                onDelete={handleRemoveEntry}
                onEdit={handleEditEntry}
                title="Registros do Mês"
                subtitle="Edite ou remova seus registros"
              />
            )}
          </div>

          {/* Monthly totals */}
          {entries.length > 0 && (
            <div className="animate-slide-up !mt-6" style={{ animationDelay: '80ms' }}>
              <SummaryCards totalMinutes={totalMinutes} totalEarnings={totalEarnings} />
            </div>
          )}

          {/* Action buttons */}
          {entries.length > 0 && (
            <div className="animate-fade-in !mt-6" style={{ animationDelay: '120ms' }}>
              <ActionButtons
                entries={entries}
                totalMinutes={totalMinutes}
                monthLabel={monthLabel}
                userName={user?.name}
                isAuthenticated={isAuthenticated}
                isSaving={isSaving}
                unsavedCount={unsavedEntries.length}
                onSave={handleSave}
                onAuthRequired={handleAuthRequired}
              />
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  )
}
