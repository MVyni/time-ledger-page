import type { WorkEntryRepository } from './work-entry-repository'
import type {
  CreateWorkEntryRequest,
  FetchEntriesResponse,
  FetchHistoryResponse,
} from '@/types'
import { HttpClient } from '@/lib/http-client'
import { AppError, NetworkError } from '@/errors'

export class HttpWorkEntryRepository implements WorkEntryRepository {
  constructor(private httpClient: HttpClient) {}

  async create(data: CreateWorkEntryRequest): Promise<void> {
    try {
      await this.httpClient.post('/api/workentrie/create', data)
    } catch (error) {
      if (error instanceof AppError) throw error
      if (this.isHttpError(error)) {
        const status = error.status
        if (status === 409) throw new AppError('Já existe um registro para esta data.', 409)
        if (status === 400) throw new AppError(await this.extractMessage(error), 400)
        if (status === 401) throw new AppError('Sessão expirada. Faça login novamente.', 401)
      }
      throw new NetworkError()
    }
  }

  async list(): Promise<FetchEntriesResponse> {
    try {
      return await this.httpClient.get<FetchEntriesResponse>('/api/workentrie/list')
    } catch (error) {
      if (error instanceof AppError) throw error
      if (this.isHttpError(error)) {
        if (error.status === 401) throw new AppError('Sessão expirada. Faça login novamente.', 401)
      }
      throw new NetworkError()
    }
  }

  async history(): Promise<FetchHistoryResponse> {
    try {
      return await this.httpClient.get<FetchHistoryResponse>('/api/workentrie/history')
    } catch (error) {
      if (error instanceof AppError) throw error
      if (this.isHttpError(error)) {
        if (error.status === 401) throw new AppError('Sessão expirada. Faça login novamente.', 401)
      }
      throw new NetworkError()
    }
  }

  async delete(workEntryId: string): Promise<void> {
    try {
      await this.httpClient.delete(`/api/workentrie/delete/${workEntryId}`)
    } catch (error) {
      if (error instanceof AppError) throw error
      if (this.isHttpError(error)) {
        if (error.status === 404) throw new AppError('Registro não encontrado.', 404)
        if (error.status === 401) throw new AppError('Sessão expirada. Faça login novamente.', 401)
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
