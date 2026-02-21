import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  makeFetchWorkEntriesService,
  makeCreateWorkEntryService,
  makeDeleteWorkEntryService,
  makeUpdateWorkEntryService,
} from '@/services/factories'
import type { WorkEntry, WorkEntryApiResponse } from '@/types'

const GUEST_ENTRIES_KEY = '@time-ledger:guest-entries:v1'
const GUEST_TTL_DAYS = 31

function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function mapApiToWorkEntry(entry: WorkEntryApiResponse): WorkEntry {
  return {
    id: entry.id,
    date: entry.date,
    durationMinutes: entry.duration_minutes,
    hourlyRate: Number(entry.hourly_rate_at_time),
    saved: true,
  }
}

function getMonthBounds(year: number, month: number) {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

function pruneGuestEntries(entries: WorkEntry[]): WorkEntry[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - GUEST_TTL_DAYS)

  return entries.filter(e => {
    if (e.saved) return false
    const d = new Date(e.date)
    if (Number.isNaN(d.getTime())) return false
    return d >= cutoff
  })
}

function loadGuestEntries(): WorkEntry[] {
  try {
    const raw = localStorage.getItem(GUEST_ENTRIES_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const entries: WorkEntry[] = parsed
      .filter((e: any) => e && typeof e === 'object')
      .map((e: any) => ({
        id: String(e.id),
        date: String(e.date),
        durationMinutes: Number(e.durationMinutes),
        hourlyRate: Number(e.hourlyRate),
        saved: false,
      }))
      .filter(e =>
        typeof e.id === 'string' &&
        e.id.length > 0 &&
        typeof e.date === 'string' &&
        Number.isFinite(e.durationMinutes) &&
        Number.isFinite(e.hourlyRate),
      )

    return pruneGuestEntries(entries)
  } catch {
    return []
  }
}

function saveGuestEntries(entries: WorkEntry[]) {
  try {
    const pruned = pruneGuestEntries(entries)
    localStorage.setItem(GUEST_ENTRIES_KEY, JSON.stringify(pruned))
  } catch {
    // ignore quota/security errors
  }
}

function clearGuestEntries() {
  try {
    localStorage.removeItem(GUEST_ENTRIES_KEY)
  } catch {
    // ignore
  }
}

export function useWorkEntries() {
  const { isAuthenticated } = useAuth()
  const [entries, setEntries] = useState<WorkEntry[]>(() => loadGuestEntries())
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())

  const loadEntries = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    try {
      const service = makeFetchWorkEntriesService()
      const { entries: apiEntries } = await service.execute()
      const mapped = apiEntries.map(mapApiToWorkEntry)

      // Keep any pending entries from cache (survive reload)
      const cachedUnsaved = loadGuestEntries()

      setEntries(prev => {
        const unsaved = prev.filter(e => !e.saved)
        const mergedUnsaved = [...cachedUnsaved, ...unsaved]

        // Deduplicate by day (prefer existing state order)
        const seen = new Set<string>()
        const uniqueUnsaved = mergedUnsaved.filter(e => {
          const key = new Date(e.date).toDateString()
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })

        return [...mapped, ...uniqueUnsaved]
      })
    } catch {
      // silently fail — entries stay empty
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  useEffect(() => {
    // When user logs out, restore cached pending entries (if any)
    if (!isAuthenticated) {
      setEntries(loadGuestEntries())
    }
  }, [isAuthenticated])

  useEffect(() => {
    // Persist all unsaved entries (guest or post-login pending) for 31 days
    const unsaved = entries.filter(e => !e.saved)
    saveGuestEntries(unsaved)
  }, [entries])

  const monthlyEntries = useMemo(() => {
    const { start, end } = getMonthBounds(currentYear, currentMonth)
    return entries
      .filter(e => {
        const d = new Date(e.date)
        return d >= start && d <= end
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [entries, currentMonth, currentYear])

  const pendingEntries = useMemo(() => {
    return entries
      .filter(e => !e.saved)
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [entries])

  const totalHours = useMemo(
    () => monthlyEntries.reduce((sum, e) => sum + e.durationMinutes / 60, 0),
    [monthlyEntries],
  )

  const totalMinutes = useMemo(
    () => monthlyEntries.reduce((sum, e) => sum + e.durationMinutes, 0),
    [monthlyEntries],
  )

  const pendingTotalMinutes = useMemo(
    () => pendingEntries.reduce((sum, e) => sum + e.durationMinutes, 0),
    [pendingEntries],
  )

  const totalEarnings = useMemo(
    () =>
      monthlyEntries.reduce(
        (sum, e) => sum + (e.durationMinutes / 60) * e.hourlyRate,
        0,
      ),
    [monthlyEntries],
  )

  const pendingTotalEarnings = useMemo(
    () =>
      pendingEntries.reduce(
        (sum, e) => sum + (e.durationMinutes / 60) * e.hourlyRate,
        0,
      ),
    [pendingEntries],
  )

  const unsavedEntries = useMemo(
    () => monthlyEntries.filter(e => !e.saved),
    [monthlyEntries],
  )

  const addEntry = useCallback(
    (date: string, durationMinutes: number, ratePerHour: number) => {
      if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 24 * 60) {
        throw new Error('Duração inválida.')
      }

      // Check duplicate date in current entries
      const dateStr = new Date(date).toDateString()
      const duplicate = entries.find(
        e => new Date(e.date).toDateString() === dateStr,
      )
      if (duplicate) {
        throw new Error('Já existe um registro para esta data.')
      }

      const entry: WorkEntry = {
        id: generateTempId(),
        date: new Date(date).toISOString(),
        durationMinutes,
        hourlyRate: ratePerHour,
        saved: false,
      }

      setEntries(prev => [...prev, entry])
    },
    [entries],
  )

  const updateEntry = useCallback(
    (id: string, data: { date: string; durationMinutes: number; hourlyRate: number }) => {
      if (!Number.isFinite(data.durationMinutes) || data.durationMinutes <= 0 || data.durationMinutes > 24 * 60) {
        throw new Error('Duração inválida.')
      }
      if (!Number.isFinite(data.hourlyRate) || data.hourlyRate <= 0) {
        throw new Error('Valor/hora inválido.')
      }

      const nextDate = new Date(data.date)
      if (Number.isNaN(nextDate.getTime())) {
        throw new Error('Data inválida.')
      }

      // Prevent duplicate date (same rule as backend)
      const nextDateStr = nextDate.toDateString()
      const duplicate = entries.find(e => e.id !== id && new Date(e.date).toDateString() === nextDateStr)
      if (duplicate) {
        throw new Error('Já existe um registro para esta data.')
      }

      setEntries(prev =>
        prev.map(e => {
          if (e.id !== id) return e
          if (e.saved) return e // editing saved entries is not supported here

          return {
            ...e,
            date: nextDate.toISOString(),
            durationMinutes: data.durationMinutes,
            hourlyRate: data.hourlyRate,
          }
        }),
      )
    },
    [entries],
  )

  const editEntry = useCallback(
    async (id: string, data: { date: string; durationMinutes: number; hourlyRate: number }) => {
      if (!Number.isFinite(data.durationMinutes) || data.durationMinutes <= 0 || data.durationMinutes > 24 * 60) {
        throw new Error('Duração inválida.')
      }
      if (!Number.isFinite(data.hourlyRate) || data.hourlyRate <= 0) {
        throw new Error('Valor/hora inválido.')
      }

      const nextDate = new Date(data.date)
      if (Number.isNaN(nextDate.getTime())) {
        throw new Error('Data inválida.')
      }

      const target = entries.find(e => e.id === id)
      if (!target) return

      // Prevent duplicate date (same rule as backend)
      const nextDateStr = nextDate.toDateString()
      const duplicate = entries.find(e => e.id !== id && new Date(e.date).toDateString() === nextDateStr)
      if (duplicate) {
        throw new Error('Já existe um registro para esta data.')
      }

      // Pending (unsaved): update locally
      if (!target.saved) {
        updateEntry(id, data)
        return
      }

      // Saved: update via API and reflect locally
      if (!isAuthenticated) {
        throw new Error('AUTH_REQUIRED')
      }

      const service = makeUpdateWorkEntryService()
      await service.execute(id, {
        date: nextDate.toISOString(),
        durationMinutes: data.durationMinutes,
        hourlyRateAtTime: data.hourlyRate,
      })

      setEntries(prev =>
        prev.map(e => {
          if (e.id !== id) return e
          return {
            ...e,
            date: nextDate.toISOString(),
            durationMinutes: data.durationMinutes,
            hourlyRate: data.hourlyRate,
            saved: true,
          }
        }),
      )
    },
    [entries, isAuthenticated, updateEntry],
  )

  const removeEntry = useCallback(
    async (id: string) => {
      const entry = entries.find(e => e.id === id)
      if (!entry) return

      if (entry.saved && isAuthenticated) {
        try {
          const service = makeDeleteWorkEntryService()
          await service.execute(id)
        } catch {
          throw new Error('Erro ao deletar registro.')
        }
      }

      setEntries(prev => prev.filter(e => e.id !== id))
    },
    [entries, isAuthenticated],
  )

  const saveAll = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('AUTH_REQUIRED')
    }

    const allUnsaved = entries.filter(e => !e.saved)
    if (allUnsaved.length === 0) return

    setIsSaving(true)
    try {
      const service = makeCreateWorkEntryService()

      for (const entry of allUnsaved) {
        await service.execute({
          date: entry.date,
          durationMinutes: entry.durationMinutes,
          hourlyRateAtTime: entry.hourlyRate,
        })
      }

      // Saved successfully: clear local pending list immediately
      setEntries(prev => prev.filter(e => e.saved))

      // Clear guest cache BEFORE reloading to avoid re-merging old pendings
      clearGuestEntries()

      // Reload entries from backend to get real IDs
      await loadEntries()
    } finally {
      setIsSaving(false)
    }
  }, [isAuthenticated, entries, loadEntries])

  const monthLabel = useMemo(() => {
    const date = new Date(currentYear, currentMonth)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }, [currentMonth, currentYear])

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1)
        return 11
      }
      return prev - 1
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1)
        return 0
      }
      return prev + 1
    })
  }, [])

  return {
    entries: monthlyEntries,
    allEntries: entries,
    pendingEntries,
    unsavedEntries,
    totalHours,
    totalMinutes,
    pendingTotalMinutes,
    totalEarnings,
    pendingTotalEarnings,
    isLoading,
    isSaving,
    monthLabel,
    currentMonth,
    currentYear,
    addEntry,
    updateEntry,
    editEntry,
    removeEntry,
    saveAll,
    goToPreviousMonth,
    goToNextMonth,
    loadEntries,
  }
}
