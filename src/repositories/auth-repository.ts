import type { AuthResponse, RegisterRequest, AuthenticateRequest } from '@/types'

export interface AuthRepository {
  register(data: RegisterRequest): Promise<void>
  authenticate(data: AuthenticateRequest): Promise<AuthResponse>
}
