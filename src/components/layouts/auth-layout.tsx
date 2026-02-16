import { type ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full flex-1 flex flex-col bg-slate-950">
      <main className="w-full flex-1 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-lg shadow-black/25">
            <div className="animate-fade-in">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
