import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useMonthlyHistory } from '@/hooks'
import { CalendarDays, ArrowLeft, Lock } from 'lucide-react'
import { MonthCard } from '@/components/history'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui'
import { useState } from 'react'
import { makeDeleteWorkEntryService, makeFetchWorkEntriesService } from '@/services/factories'

export function HistoryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { history, isLoading, reload } = useMonthlyHistory()
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  function handleMonthClick(month: number, year: number) {
    navigate(`/history/${year}/${month}`)
  }

  async function handleDeleteMonth(month: number, year: number) {
    const key = `${year}-${month}`
    if (deletingKey) return

    setDeletingKey(key)
    try {
      const fetchService = makeFetchWorkEntriesService()
      const { entries } = await fetchService.execute()

      const ids = entries
        .filter(e => {
          const d = new Date(e.date)
          return d.getFullYear() === year && d.getMonth() + 1 === month
        })
        .map(e => e.id)

      const deleteService = makeDeleteWorkEntryService()
      for (const id of ids) {
        await deleteService.execute(id)
      }

      await reload()
    } finally {
      setDeletingKey(null)
    }
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
                Faça login para acessar seu histórico completo.
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
              onClick={() => navigate('/')}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-200">Histórico</h1>
              <p className="text-xs text-slate-500">Resumo mensal dos seus registros</p>
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <CalendarDays size={48} className="mb-4 text-slate-600" />
              <p className="text-sm font-medium">Nenhum histórico encontrado</p>
              <p className="mt-1 text-xs text-slate-600">
                Comece adicionando seus primeiros registros
              </p>
            </div>
          ) : (
            <div className="!space-y-3">
              {history
                .sort((a, b) => {
                  if (a.year !== b.year) return b.year - a.year
                  return b.month - a.month
                })
                .map((item, index) => (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <MonthCard
                      data={item}
                      onClick={() => handleMonthClick(item.month, item.year)}
                      onDelete={() => handleDeleteMonth(item.month, item.year)}
                      isDeleting={deletingKey === `${item.year}-${item.month}`}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
