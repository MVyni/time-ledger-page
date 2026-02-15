import type { AuthRepository } from '@/repositories/auth-repository'
import type { AuthenticateRequest, AuthResponse } from '@/types'

export class AuthenticateUserService {
  constructor(private authRepository: AuthRepository) {}

  async execute(data: AuthenticateRequest): Promise<AuthResponse> {
    return this.authRepository.authenticate(data)
  }
}
