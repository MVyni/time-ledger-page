import type { AuthRepository } from '@/repositories/auth-repository'
import type { AuthResponse, RegisterRequest, AuthenticateRequest } from '@/types'
import { InvalidCredentialsError, UserAlreadyExistsError } from '@/errors'

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
}

export class InMemoryAuthRepository implements AuthRepository {
  public users: StoredUser[] = []
  private tokenCounter = 0

  async register(data: RegisterRequest): Promise<void> {
    const exists = this.users.find(u => u.email === data.email)
    if (exists) throw new UserAlreadyExistsError()

    this.users.push({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
    })
  }

  async authenticate(data: AuthenticateRequest): Promise<AuthResponse> {
    const user = this.users.find(u => u.email === data.email)
    if (!user || user.password !== data.password) {
      throw new InvalidCredentialsError()
    }

    this.tokenCounter++
    return { token: `fake-jwt-token-${this.tokenCounter}` }
  }
}
