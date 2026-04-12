import { describe, it, expect, beforeEach } from 'vitest'
import { CreateWorkEntryService } from '@/services/work-entries/create-work-entry'
import { InMemoryWorkEntryRepository } from '@/repositories/in-memory/in-memory-work-entry-repository'
import { AppError } from '@/errors'

describe('CreateWorkEntryService (unit)', () => {
  let repository: InMemoryWorkEntryRepository
  let sut: CreateWorkEntryService

  beforeEach(() => {
    repository = new InMemoryWorkEntryRepository()
    sut = new CreateWorkEntryService(repository)
  })

  it('should be able to create a work entry', async () => {
    await sut.execute({
      date: '2026-04-12',
      durationMinutes: 480,
      hourlyRateAtTime: 50,
    })

    expect(repository.items).toHaveLength(1)
    expect(repository.items[0]!.duration_minutes).toBe(480)
    expect(repository.items[0]!.hourly_rate_at_time).toBe('50')
  })

  it('should not be able to create a work entry twice on the same day', async () => {
    await sut.execute({
      date: '2026-04-12',
      durationMinutes: 480,
      hourlyRateAtTime: 50,
    })

    await expect(
      sut.execute({
        date: '2026-04-12',
        durationMinutes: 240,
        hourlyRateAtTime: 60,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
