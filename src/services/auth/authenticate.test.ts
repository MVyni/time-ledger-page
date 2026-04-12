import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateUserService } from '@/services/auth/authenticate'
import { InMemoryAuthRepository } from '@/repositories/in-memory/in-memory-auth-repository'
import { InvalidCredentialsError } from '@/errors'

describe('AuthenticateUserService (unit)', () => {
  let repository: InMemoryAuthRepository
  let sut: AuthenticateUserService

  beforeEach(async () => {
    repository = new InMemoryAuthRepository()
    sut = new AuthenticateUserService(repository)

    await repository.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })
  })

  it('should be able to authenticate a user', async () => {
    const result = await sut.execute({
      email: 'john@example.com',
      password: '123456',
    })

    expect(result.token).toEqual(expect.any(String))
    expect(result.token.length).toBeGreaterThan(0)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await expect(
      sut.execute({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
