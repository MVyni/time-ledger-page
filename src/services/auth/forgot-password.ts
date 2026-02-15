import type { AuthRepository } from '@/repositories/auth-repository'

export class ForgotPasswordService {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string): Promise<void> {
    await this.authRepository.forgotPassword(email)
  }
}
