import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUserService } from '@/services/auth/register'
import { InMemoryAuthRepository } from '@/repositories/in-memory/in-memory-auth-repository'
import { UserAlreadyExistsError } from '@/errors'

describe('RegisterUserService (unit)', () => {
  let repository: InMemoryAuthRepository
  let sut: RegisterUserService

  beforeEach(() => {
    repository = new InMemoryAuthRepository()
    sut = new RegisterUserService(repository)
  })

  it('should be able to register a user', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(repository.users).toHaveLength(1)
    expect(repository.users[0]!.email).toBe('john@example.com')
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(
      sut.execute({
        name: 'Jane Doe',
        email: 'john@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
