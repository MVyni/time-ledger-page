import { type FormEvent, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { Input, Button, Toast } from '@/components/ui'
import { useForm, useToast } from '@/hooks'
import { resetPasswordSchema } from '@/validators/auth-schemas'
import { makeResetPasswordService } from '@/services/factories'
import { AppError } from '@/errors'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [resetDone, setResetDone] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setErrors,
  } = useForm({ password: '', confirmPassword: '' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!token) {
      showToast('Link de redefinição inválido.', 'error')
      return
    }

    const result = resetPasswordSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const resetPasswordService = makeResetPasswordService()
      await resetPasswordService.execute(token, values.password)
      setResetDone(true)
    } catch (error) {
      if (error instanceof AppError) {
        showToast(error.message, 'error')
      } else {
        showToast('Ocorreu um erro inesperado.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">
              Link inválido
            </h2>
            <p className="text-slate-400">
              Este link de redefinição de senha é inválido ou expirou.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Solicitar novo link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {resetDone ? (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">
              Senha redefinida!
            </h2>
            <p className="text-slate-400">
              Sua senha foi alterada com sucesso. Agora você pode fazer login
              com sua nova senha.
            </p>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="w-full"
            size="lg"
          >
            Ir para o login
          </Button>
        </div>
      ) : (
        <>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>

          <div className="space-y-2 mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
              Nova senha
            </h2>
            <p className="text-slate-400 text-lg">
              Digite sua nova senha abaixo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nova senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={Lock}
              value={values.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirmar nova senha"
              type="password"
              placeholder="Repita sua nova senha"
              icon={Lock}
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Redefinir senha
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  )
}
