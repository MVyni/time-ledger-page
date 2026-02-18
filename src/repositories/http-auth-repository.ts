import type { AuthRepository } from './auth-repository'
import type { AuthResponse, RegisterRequest, AuthenticateRequest } from '@/types'
import { HttpClient } from '@/lib/http-client'
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  NetworkError,
  AppError,
} from '@/errors'

export class HttpAuthRepository implements AuthRepository {
  constructor(private httpClient: HttpClient) {}

  async register(data: RegisterRequest): Promise<void> {
    try {
      await this.httpClient.post('/api/user/register', data)
    } catch (error) {
      if (error instanceof AppError) throw error
      if (this.isHttpError(error)) {
        const status = error.status
        if (status === 409) throw new UserAlreadyExistsError()
        if (status === 400) throw new AppError(await this.extractMessage(error), 400)
      }
      throw new NetworkError()
    }
  }

  async authenticate(data: AuthenticateRequest): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<AuthResponse>('/api/user/session', data)
      return response
    } catch (error) {
      if (error instanceof AppError) throw error
      if (this.isHttpError(error)) {
        const status = error.status
        if (status === 400 || status === 401) throw new InvalidCredentialsError()
      }
      throw new NetworkError()
    }
  }

  private isHttpError(error: unknown): error is Response {
    return error instanceof Response
  }

  private async extractMessage(error: Response): Promise<string> {
    try {
      const body = await error.json()
      return body.message ?? 'Erro de validação.'
    } catch {
      return 'Ocorreu um erro inesperado.'
    }
  }
}
