import { HttpAuthRepository } from '@/repositories/http-auth-repository'
import { ForgotPasswordService } from '@/services/auth/forgot-password'
import { httpClient } from '@/lib/http-client'

export function makeForgotPasswordService(): ForgotPasswordService {
  const authRepository = new HttpAuthRepository(httpClient)
  return new ForgotPasswordService(authRepository)
}
