import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateWorkEntryService } from '@/services/work-entries/update-work-entry'
import { InMemoryWorkEntryRepository } from '@/repositories/in-memory/in-memory-work-entry-repository'
import { AppError } from '@/errors'

describe('UpdateWorkEntryService (unit)', () => {
  let repository: InMemoryWorkEntryRepository
  let sut: UpdateWorkEntryService

  beforeEach(() => {
    repository = new InMemoryWorkEntryRepository()
    sut = new UpdateWorkEntryService(repository)
  })

  it('should be able to update a work entry', async () => {
    await repository.create({
      date: '2026-04-12',
      durationMinutes: 480,
      hourlyRateAtTime: 50,
    })

    const entryId = repository.items[0]!.id

    await sut.execute(entryId, {
      date: '2026-04-13',
      durationMinutes: 120,
      hourlyRateAtTime: 100,
    })

    expect(repository.items[0]!.duration_minutes).toBe(120)
    expect(repository.items[0]!.hourly_rate_at_time).toBe('100')
  })

  it('should not be able to update a non-existing work entry', async () => {
    await expect(
      sut.execute('non-existing-id', {
        date: '2026-04-12',
        durationMinutes: 120,
        hourlyRateAtTime: 100,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update to a date that already has an entry', async () => {
    await repository.create({
      date: '2026-04-12',
      durationMinutes: 480,
      hourlyRateAtTime: 50,
    })

    await repository.create({
      date: '2026-04-13',
      durationMinutes: 240,
      hourlyRateAtTime: 60,
    })

    const entryId = repository.items[0]!.id

    await expect(
      sut.execute(entryId, {
        date: '2026-04-13',
        durationMinutes: 120,
        hourlyRateAtTime: 100,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
