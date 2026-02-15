import type { AuthRepository } from '@/repositories/auth-repository'

export class ResetPasswordService {
  constructor(private authRepository: AuthRepository) {}

  async execute(token: string, password: string): Promise<void> {
    await this.authRepository.resetPassword(token, password)
  }
}
