import type { AuthRepository } from '@/repositories/auth-repository'
import type { RegisterRequest } from '@/types'

export class RegisterUserService {
  constructor(private authRepository: AuthRepository) {}

  async execute(data: RegisterRequest): Promise<void> {
    await this.authRepository.register(data)
  }
}
