import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { httpClient } from '@/lib/http-client'
import type { MonthlyHistory } from '@/types'

interface FetchHistoryResponse {
  monthlyHistory: MonthlyHistory[]
}

export function useMonthlyHistory() {
  const { isAuthenticated } = useAuth()
  const [history, setHistory] = useState<MonthlyHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setHistory([])
      return
    }

    setIsLoading(true)
    try {
      const response = await httpClient.get<FetchHistoryResponse>('/api/workentrie/history')
      setHistory(response.monthlyHistory || [])
    } catch {
      setHistory([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return {
    history,
    isLoading,
    reload: loadHistory,
  }
}
