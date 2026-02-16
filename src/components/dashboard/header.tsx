import { Clock, History, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useNavigate } from 'react-router-dom'

export function DashboardHeader() {
  const { isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="ios-no-backdrop sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="w-full flex justify-center">
        <div className="flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-slate-800/60"
            title="Ir para início"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg" />
              <Clock size={22} className="relative z-10 text-blue-400" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-50">
              Time<span className="text-blue-400">Ledger</span>
            </h1>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              title="Histórico"
            >
              <History size={20} />
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={signOut}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-blue-400 transition-colors hover:bg-slate-800"
                title="Entrar"
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
