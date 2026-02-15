import { HttpAuthRepository } from '@/repositories/http-auth-repository'
import { AuthenticateUserService } from '@/services/auth/authenticate'
import { httpClient } from '@/lib/http-client'

export function makeAuthenticateUserService(): AuthenticateUserService {
  const authRepository = new HttpAuthRepository(httpClient)
  return new AuthenticateUserService(authRepository)
}
