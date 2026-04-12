import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from '@/hooks/use-form'

describe('useForm (unit)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useForm({ email: '', password: '' }),
    )

    expect(result.current.values).toEqual({ email: '', password: '' })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should update field value on change', () => {
    const { result } = renderHook(() =>
      useForm({ email: '', password: '' }),
    )

    act(() => {
      const handler = result.current.handleChange('email')
      handler({ target: { value: 'john@example.com' } } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.values.email).toBe('john@example.com')
  })

  it('should clear field error when value changes', () => {
    const { result } = renderHook(() =>
      useForm({ email: '' }),
    )

    act(() => {
      result.current.setFieldError('email', 'E-mail inválido.')
    })

    expect(result.current.errors.email).toBe('E-mail inválido.')

    act(() => {
      const handler = result.current.handleChange('email')
      handler({ target: { value: 'new@email.com' } } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.errors.email).toBeUndefined()
  })

  it('should set field error', () => {
    const { result } = renderHook(() =>
      useForm({ email: '' }),
    )

    act(() => {
      result.current.setFieldError('email', 'Campo obrigatório.')
    })

    expect(result.current.errors.email).toBe('Campo obrigatório.')
  })

  it('should clear all errors', () => {
    const { result } = renderHook(() =>
      useForm({ email: '', password: '' }),
    )

    act(() => {
      result.current.setFieldError('email', 'Erro 1')
      result.current.setFieldError('password', 'Erro 2')
    })

    act(() => {
      result.current.clearErrors()
    })

    expect(result.current.errors).toEqual({})
  })

  it('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({ email: '', password: '' }),
    )

    act(() => {
      const handler = result.current.handleChange('email')
      handler({ target: { value: 'john@example.com' } } as React.ChangeEvent<HTMLInputElement>)
      result.current.setFieldError('email', 'Erro')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual({ email: '', password: '' })
    expect(result.current.errors).toEqual({})
  })
})
