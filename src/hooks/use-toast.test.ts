import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

describe('useToast (unit)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should start hidden', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toast.visible).toBe(false)
    expect(result.current.toast.message).toBe('')
  })

  it('should show a toast message', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Salvo com sucesso!', 'success')
    })

    expect(result.current.toast.visible).toBe(true)
    expect(result.current.toast.message).toBe('Salvo com sucesso!')
    expect(result.current.toast.type).toBe('success')
  })

  it('should auto-hide after 5 seconds', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Mensagem', 'info')
    })

    expect(result.current.toast.visible).toBe(true)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.toast.visible).toBe(false)
  })

  it('should hide toast manually', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Erro!', 'error')
    })

    act(() => {
      result.current.hideToast()
    })

    expect(result.current.toast.visible).toBe(false)
  })

  it('should replace toast when showing a new one', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Primeira', 'info')
    })

    act(() => {
      result.current.showToast('Segunda', 'error')
    })

    expect(result.current.toast.message).toBe('Segunda')
    expect(result.current.toast.type).toBe('error')
  })
})
