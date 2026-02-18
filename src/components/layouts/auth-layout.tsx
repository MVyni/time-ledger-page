import { type ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full flex-1 flex flex-col bg-slate-950">
      <main className="w-full flex-1 flex items-stretch justify-center px-0 py-0 lg:items-center lg:px-6 lg:py-14">
        <div className="w-full lg:max-w-lg">
          <div
            className="min-h-screen rounded-none border-0 bg-slate-950 p-6 shadow-none flex flex-col justify-center lg:min-h-0 lg:rounded-2xl lg:border lg:border-slate-800 lg:bg-slate-900/60 lg:p-8 lg:shadow-lg lg:shadow-black/25"
            style={{ minHeight: '100dvh', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <div className="animate-fade-in">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
