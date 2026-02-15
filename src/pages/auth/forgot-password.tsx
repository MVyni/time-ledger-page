import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { Input, Button, Logo, Toast } from '@/components/ui'
import { useForm, useToast } from '@/hooks'
import { forgotPasswordSchema } from '@/validators/auth-schemas'
import { makeForgotPasswordService } from '@/services/factories'

export function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setErrors,
  } = useForm({ email: '' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const result = forgotPasswordSchema.safeParse(values)

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
      const forgotPasswordService = makeForgotPasswordService()
      await forgotPasswordService.execute(values.email)
      setEmailSent(true)
    } catch {
      showToast('Ocorreu um erro. Tente novamente.', 'error')
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

      {emailSent ? (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">E-mail enviado!</h2>
            <p className="text-slate-400 leading-relaxed">
              Se existe uma conta com o e-mail{' '}
              <span className="font-medium text-slate-200">{values.email}</span>,
              você receberá um link para redefinir sua senha.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm text-slate-500">
              Não recebeu o e-mail? Verifique a pasta de spam ou
            </p>
            <Button
              variant="secondary"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Tentar novamente
            </Button>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
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

          <div className="space-y-2 mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
              Esqueceu sua senha?
            </h2>
            <p className="text-slate-400 text-lg">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Enviar link de redefinição
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  )
}