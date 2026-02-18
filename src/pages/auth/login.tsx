import { type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { Input, Button, Toast } from '@/components/ui'
import { useForm, useToast } from '@/hooks'
import { loginSchema } from '@/validators/auth-schemas'
import { makeAuthenticateUserService } from '@/services/factories'
import { useAuth } from '@/contexts/auth-context'
import { AppError } from '@/errors'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setErrors,
  } = useForm({ email: '', password: '' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const result = loginSchema.safeParse(values)

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
      const authenticateService = makeAuthenticateUserService()
      const { token } = await authenticateService.execute({
        email: values.email,
        password: values.password,
      })

      signIn(token)
      navigate('/dashboard', { replace: true })
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

  return (
    <AuthLayout>
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="!mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
          Bem-vindo de volta
        </h2>
        <p className="text-slate-400 text-lg">
          Entre na sua conta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="!space-y-3">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          icon={Mail}
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex flex-col gap-5 !p-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/30"
            />
            <span className="text-sm text-slate-400">Lembrar de mim</span>
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
            size="lg"
          >
            Entrar
          </Button>
        </div>
      </form>

      <div className="!mt-10">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/70" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-950 px-4 text-slate-500 lg:bg-slate-900/60">ou</span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 !mt-5">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Criar conta gratuitamente
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
