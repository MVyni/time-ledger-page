import { describe, it, expect, beforeEach } from 'vitest'
import { FetchWorkEntriesService } from '@/services/work-entries/fetch-work-entries'
import { InMemoryWorkEntryRepository } from '@/repositories/in-memory/in-memory-work-entry-repository'

describe('FetchWorkEntriesService (unit)', () => {
  let repository: InMemoryWorkEntryRepository
  let sut: FetchWorkEntriesService

  beforeEach(() => {
    repository = new InMemoryWorkEntryRepository()
    sut = new FetchWorkEntriesService(repository)
  })

  it('should be able to fetch work entries list', async () => {
    await repository.create({
      date: '2026-01-01',
      durationMinutes: 60,
      hourlyRateAtTime: 50,
    })

    await repository.create({
      date: '2026-01-02',
      durationMinutes: 120,
      hourlyRateAtTime: 60,
    })

    const result = await sut.execute()

    expect(result.entries).toHaveLength(2)
    expect(result.entries).toEqual([
      expect.objectContaining({
        duration_minutes: 60,
        hourly_rate_at_time: '50',
      }),
      expect.objectContaining({
        duration_minutes: 120,
        hourly_rate_at_time: '60',
      }),
    ])
  })

  it('should return entries sorted by date ascending', async () => {
    await repository.create({
      date: '2026-01-15',
      durationMinutes: 60,
      hourlyRateAtTime: 50,
    })

    await repository.create({
      date: '2026-01-01',
      durationMinutes: 120,
      hourlyRateAtTime: 60,
    })

    const result = await sut.execute()

    const dates = result.entries.map((e: { date: string }) => new Date(e.date).getTime())
    expect(dates[0]).toBeLessThan(dates[1]!)
  })

  it('should return empty list when no entries exist', async () => {
    const result = await sut.execute()
    expect(result.entries).toHaveLength(0)
  })
})
