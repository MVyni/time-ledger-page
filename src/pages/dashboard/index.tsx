import { useAuth } from '@/contexts/auth-context'
import { useWorkEntries, useToast } from '@/hooks'
import { Toast } from '@/components/ui'
import {
  DashboardHeader,
  AddEntryCard,
  PendingEntriesList,
  ActionButtons,
  SummaryCards,
} from '@/components/dashboard'

export function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const {
    pendingEntries,
    pendingTotalMinutes,
    pendingTotalEarnings,
    isSaving,
    monthLabel,
    addEntry,
    updateEntry,
    removeEntry,
    saveAll,
  } = useWorkEntries()

  function handleAddEntry(date: string, durationMinutes: number, ratePerHour: number) {
    addEntry(date, durationMinutes, ratePerHour)
    showToast('Registro adicionado à lista.', 'success')
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

  async function handleDelete(id: string) {
    try {
      await removeEntry(id)
      showToast('Registro removido.', 'info')
    } catch {
      showToast('Erro ao remover registro.', 'error')
    }
  }

  function handleEdit(id: string, data: { date: string; durationMinutes: number; hourlyRate: number }) {
    try {
      updateEntry(id, data)
      showToast('Registro atualizado.', 'success')
    } catch (err) {
      if (err instanceof Error) showToast(err.message, 'error')
      else showToast('Erro ao editar registro.', 'error')
    }
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      <DashboardHeader />

      <main
        className="w-full flex-1 pt-8 pb-24 flex justify-center"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
      >
        <div className="w-full max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col gap-y-10">
          {/* Add entry card */}
          <div className="animate-fade-in">
            <AddEntryCard onAdd={handleAddEntry} />
          </div>

          {/* Pending list */}
          {pendingEntries.length > 0 && (
            <div className="animate-fade-in">
              <PendingEntriesList
                entries={pendingEntries}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          )}

          {/* Summary cards */}
          <div className="animate-fade-in">
            <SummaryCards
              totalMinutes={pendingTotalMinutes}
              totalEarnings={pendingTotalEarnings}
            />
          </div>

          {/* Action buttons - only show if there are pending entries */}
          {pendingEntries.length > 0 && (
            <div className="animate-fade-in">
              <ActionButtons
                entries={pendingEntries}
                totalMinutes={pendingTotalMinutes}
                monthLabel={monthLabel}
                userName={user?.name}
                isAuthenticated={isAuthenticated}
                isSaving={isSaving}
                unsavedCount={pendingEntries.length}
                onSave={handleSave}
                onAuthRequired={handleAuthRequired}
              />
            </div>
          )}

          {/* Info card when no pending entries */}
            {pendingEntries.length === 0 && (
              <div className="animate-fade-in rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
                <p className="text-sm font-medium text-slate-400">
                  Nenhum registro pendente
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Adicione dias acima ou acesse o histórico
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  )
}
