import { HttpAuthRepository } from '@/repositories/http-auth-repository'
import { RegisterUserService } from '@/services/auth/register'
import { httpClient } from '@/lib/http-client'

export function makeRegisterUserService(): RegisterUserService {
  const authRepository = new HttpAuthRepository(httpClient)
  return new RegisterUserService(authRepository)
}
