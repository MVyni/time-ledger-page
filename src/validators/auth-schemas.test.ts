import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/validators/auth-schemas'

describe('Auth Schemas (unit)', () => {
  describe('loginSchema', () => {
    it('should validate a correct login', () => {
      const result = loginSchema.safeParse({
        email: 'john@example.com',
        password: '123456',
      })

      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: '123456',
      })

      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const result = loginSchema.safeParse({
        email: 'john@example.com',
        password: '123',
      })

      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate a correct registration', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      })

      expect(result.success).toBe(true)
    })

    it('should reject short name', () => {
      const result = registerSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      })

      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '654321',
      })

      expect(result.success).toBe(false)
    })

    it('should reject empty confirmPassword', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '',
      })

      expect(result.success).toBe(false)
    })
  })
})
