import { describe, it, expect } from 'vitest'
import {
  AppError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  NetworkError,
} from '@/errors'

describe('Error classes (unit)', () => {
  it('AppError should have custom message and statusCode', () => {
    const error = new AppError('Algo deu errado.', 400)

    expect(error.message).toBe('Algo deu errado.')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('AppError')
    expect(error).toBeInstanceOf(Error)
  })

  it('InvalidCredentialsError should have correct defaults', () => {
    const error = new InvalidCredentialsError()

    expect(error.message).toBe('E-mail ou senha incorretos.')
    expect(error.statusCode).toBe(401)
    expect(error.name).toBe('InvalidCredentialsError')
    expect(error).toBeInstanceOf(AppError)
  })

  it('UserAlreadyExistsError should have correct defaults', () => {
    const error = new UserAlreadyExistsError()

    expect(error.message).toBe('Este e-mail já está em uso.')
    expect(error.statusCode).toBe(409)
    expect(error.name).toBe('UserAlreadyExistsError')
    expect(error).toBeInstanceOf(AppError)
  })

  it('NetworkError should have correct defaults', () => {
    const error = new NetworkError()

    expect(error.message).toBe('Erro de conexão. Verifique sua internet.')
    expect(error.statusCode).toBe(0)
    expect(error.name).toBe('NetworkError')
    expect(error).toBeInstanceOf(AppError)
  })
})
