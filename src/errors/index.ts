export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('E-mail ou senha incorretos.', 401)
    this.name = 'InvalidCredentialsError'
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('Este e-mail já está em uso.', 409)
    this.name = 'UserAlreadyExistsError'
  }
}

export class NetworkError extends AppError {
  constructor() {
    super('Erro de conexão. Verifique sua internet.', 0)
    this.name = 'NetworkError'
  }
}
