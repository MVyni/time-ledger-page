import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteWorkEntryService } from '@/services/work-entries/delete-work-entry'
import { InMemoryWorkEntryRepository } from '@/repositories/in-memory/in-memory-work-entry-repository'
import { AppError } from '@/errors'

describe('DeleteWorkEntryService (unit)', () => {
  let repository: InMemoryWorkEntryRepository
  let sut: DeleteWorkEntryService

  beforeEach(() => {
    repository = new InMemoryWorkEntryRepository()
    sut = new DeleteWorkEntryService(repository)
  })

  it('should be able to delete a work entry', async () => {
    await repository.create({
      date: '2026-04-12',
      durationMinutes: 480,
      hourlyRateAtTime: 50,
    })

    const entryId = repository.items[0]!.id

    await sut.execute(entryId)

    expect(repository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existing work entry', async () => {
    await expect(
      sut.execute('non-existing-id'),
    ).rejects.toBeInstanceOf(AppError)
  })
})
