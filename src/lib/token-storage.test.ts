import { describe, it, expect, beforeEach } from 'vitest'
import { TokenStorage } from '@/lib/token-storage'

describe('TokenStorage (unit)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and retrieve a token', () => {
    TokenStorage.save('my-jwt-token')

    expect(TokenStorage.get()).toBe('my-jwt-token')
  })

  it('should return null when no token exists', () => {
    expect(TokenStorage.get()).toBeNull()
  })

  it('should remove a token', () => {
    TokenStorage.save('my-jwt-token')
    TokenStorage.remove()

    expect(TokenStorage.get()).toBeNull()
  })

  it('should check if token exists', () => {
    expect(TokenStorage.exists()).toBe(false)

    TokenStorage.save('my-jwt-token')
    expect(TokenStorage.exists()).toBe(true)
  })
})
