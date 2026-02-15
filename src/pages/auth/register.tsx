import { type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { Input, Button, Logo, Toast } from '@/components/ui'
import { useForm, useToast } from '@/hooks'
import { registerSchema } from '@/validators/auth-schemas'
import { makeRegisterUserService } from '@/services/factories'
import { AppError } from '@/errors'

export function RegisterPage() {
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast()
  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setErrors,
  } = useForm({ name: '', email: '', password: '', confirmPassword: '' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const result = registerSchema.safeParse(values)

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
      const registerService = makeRegisterUserService()
      await registerService.execute({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      showToast('Conta criada com sucesso! Faça login.', 'success')
      
      setTimeout(() => {
        navigate('/login')
      }, 1500)
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

      <div className="lg:hidden mb-8 flex justify-center">
        <Logo size="lg" variant="light" />
      </div>

      <div className="space-y-2 mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
          Crie sua conta
        </h2>
        <p className="text-slate-400 text-lg">
          Comece a gerenciar suas horas de trabalho
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <Input
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          icon={User}
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="name"
        />

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
          placeholder="Mínimo 6 caracteres"
          icon={Lock}
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita sua senha"
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
          Criar conta
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-10">
        Já tem uma conta?{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Fazer login
        </Link>
      </p>
    </AuthLayout>
  )
}
