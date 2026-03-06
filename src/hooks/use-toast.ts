import { useState, useCallback, useRef, useEffect } from 'react'
import type { ToastType } from '@/components/ui/toast'

interface ToastState {
  message: string
  type: ToastType
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false,
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type, visible: true })
    timerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
      timerRef.current = null
    }, 5000)
  }, [])

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setToast(prev => ({ ...prev, visible: false }))
  }, [])

  return { toast, showToast, hideToast }
}
