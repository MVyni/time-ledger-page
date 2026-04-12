import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryWorkEntryRepository } from '@/repositories/in-memory/in-memory-work-entry-repository'

describe('InMemoryWorkEntryRepository (unit)', () => {
  let repository: InMemoryWorkEntryRepository

  beforeEach(() => {
    repository = new InMemoryWorkEntryRepository()
  })

  describe('history', () => {
    it('should return monthly aggregated history', async () => {
      await repository.create({
        date: '2026-01-15',
        durationMinutes: 480,
        hourlyRateAtTime: 50,
      })

      await repository.create({
        date: '2026-01-20',
        durationMinutes: 240,
        hourlyRateAtTime: 60,
      })

      await repository.create({
        date: '2026-02-10',
        durationMinutes: 120,
        hourlyRateAtTime: 100,
      })

      const result = await repository.history()

      expect(result.monthlyHistory).toHaveLength(2)

      // Sorted DESC (Feb first, then Jan)
      expect(result.monthlyHistory[0]).toEqual(
        expect.objectContaining({
          month: 2,
          year: 2026,
          totalMinutes: 120,
          totalEarnings: 200, // 120/60 * 100
        }),
      )

      expect(result.monthlyHistory[1]).toEqual(
        expect.objectContaining({
          month: 1,
          year: 2026,
          totalMinutes: 720,  // 480 + 240
          totalEarnings: 640, // (480/60)*50 + (240/60)*60 = 400 + 240
        }),
      )
    })

    it('should return empty array when no entries exist', async () => {
      const result = await repository.history()

      expect(result.monthlyHistory).toHaveLength(0)
    })
  })

  describe('create', () => {
    it('should prevent duplicate entries on the same day', async () => {
      await repository.create({
        date: '2026-04-12',
        durationMinutes: 480,
        hourlyRateAtTime: 50,
      })

      await expect(
        repository.create({
          date: '2026-04-12',
          durationMinutes: 240,
          hourlyRateAtTime: 60,
        }),
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update entry fields', async () => {
      await repository.create({
        date: '2026-04-12',
        durationMinutes: 480,
        hourlyRateAtTime: 50,
      })

      const id = repository.items[0]!.id

      await repository.update(id, {
        date: '2026-04-13',
        durationMinutes: 120,
        hourlyRateAtTime: 100,
      })

      expect(repository.items[0]!.duration_minutes).toBe(120)
      expect(repository.items[0]!.hourly_rate_at_time).toBe('100')
    })
  })

  describe('delete', () => {
    it('should remove an entry', async () => {
      await repository.create({
        date: '2026-04-12',
        durationMinutes: 480,
        hourlyRateAtTime: 50,
      })

      const id = repository.items[0]!.id
      await repository.delete(id)

      expect(repository.items).toHaveLength(0)
    })
  })

  describe('list', () => {
    it('should return entries sorted by date', async () => {
      await repository.create({
        date: '2026-04-15',
        durationMinutes: 480,
        hourlyRateAtTime: 50,
      })

      await repository.create({
        date: '2026-04-01',
        durationMinutes: 240,
        hourlyRateAtTime: 60,
      })

      const result = await repository.list()
      const dates = result.entries.map((e: { date: string }) => new Date(e.date).getTime())

      expect(dates[0]).toBeLessThan(dates[1]!)
    })
  })
})
