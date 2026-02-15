import { type ReactNode } from 'react'
import { Logo } from '@/components/ui'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-full bg-slate-950 lg:grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:block relative bg-gradient-to-br from-surface-900 via-primary-950 to-surface-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 flex flex-col">
          <div className="mx-auto flex w-full max-w-xl flex-col justify-between px-16 py-14">
            <Logo size="lg" variant="light" />

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Gerencie seu tempo de trabalho com{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">
                  simplicidade
                </span>
              </h2>
              <p className="text-surface-200 text-lg leading-relaxed">
                Registre suas horas, acompanhe seus ganhos e tenha controle total sobre sua jornada profissional.
              </p>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-left">
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-surface-300 mt-1">Gratuito</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-left">
                <p className="text-3xl font-bold text-white">Fácil</p>
                <p className="text-sm text-surface-300 mt-1">De usar</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-left">
                <p className="text-3xl font-bold text-white">Seguro</p>
                <p className="text-sm text-surface-300 mt-1">Seus dados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-14 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-lg shadow-black/25">
            <div className="animate-fade-in">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
