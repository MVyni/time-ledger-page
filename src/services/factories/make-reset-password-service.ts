import { HttpAuthRepository } from '@/repositories/http-auth-repository'
import { ResetPasswordService } from '@/services/auth/reset-password'
import { httpClient } from '@/lib/http-client'

export function makeResetPasswordService(): ResetPasswordService {
  const authRepository = new HttpAuthRepository(httpClient)
  return new ResetPasswordService(authRepository)
}
