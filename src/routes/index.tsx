import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from '@/contexts/auth-context'
import { PublicRoute } from '@/routes/public-route'

const LoginPage = lazy(() => import('@/pages/auth/login').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/register').then(m => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.DashboardPage })))
const HistoryPage = lazy(() => import('@/pages/history').then(m => ({ default: m.HistoryPage })))
const HistoryDetailsPage = lazy(() => import('@/pages/history/details').then(m => ({ default: m.HistoryDetailsPage })))

function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Public auth routes - redirect to dashboard if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Dashboard - accessible to all (save/export locked behind auth) */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* History - accessible to all (shows lock if not authenticated) */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:year/:month" element={<HistoryDetailsPage />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
