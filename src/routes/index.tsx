import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from '@/contexts/auth-context'
import { PublicRoute } from '@/routes/public-route'

import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { HistoryPage } from '@/pages/history'
import { HistoryDetailsPage } from '@/pages/history/details'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes - redirect to dashboard if authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
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
      </AuthProvider>
    </BrowserRouter>
  )
}
