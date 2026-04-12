import type { WorkEntryRepository } from '@/repositories/work-entry-repository'
import type {
  CreateWorkEntryRequest,
  FetchEntriesResponse,
  FetchHistoryResponse,
  WorkEntryApiResponse,
  MonthlyHistory,
} from '@/types'
import { AppError } from '@/errors'

export class InMemoryWorkEntryRepository implements WorkEntryRepository {
  public items: WorkEntryApiResponse[] = []

  async create(data: CreateWorkEntryRequest): Promise<void> {
    const entryDate = new Date(data.date).toDateString()
    const duplicate = this.items.find(
      e => new Date(e.date).toDateString() === entryDate,
    )
    if (duplicate) {
      throw new AppError('Já existe um registro para esta data.', 409)
    }

    this.items.push({
      id: crypto.randomUUID(),
      date: new Date(data.date).toISOString(),
      duration_minutes: data.durationMinutes,
      hourly_rate_at_time: String(data.hourlyRateAtTime),
      user_id: 'user-1',
    })
  }

  async list(): Promise<FetchEntriesResponse> {
    const sorted = [...this.items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    return { entries: sorted }
  }

  async history(): Promise<FetchHistoryResponse> {
    const grouped: Record<string, MonthlyHistory> = {}

    for (const entry of this.items) {
      const d = new Date(entry.date)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`

      if (!grouped[key]) {
        grouped[key] = {
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          totalMinutes: 0,
          totalEarnings: 0,
        }
      }

      const g = grouped[key]!
      g.totalMinutes += entry.duration_minutes
      const hours = entry.duration_minutes / 60
      g.totalEarnings += hours * Number(entry.hourly_rate_at_time)
    }

    const monthlyHistory = Object.values(grouped)
      .sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year
        return b.month - a.month
      })
      .map(h => ({
        ...h,
        totalEarnings: Number(h.totalEarnings.toFixed(2)),
      }))

    return { monthlyHistory }
  }

  async update(workEntryId: string, data: CreateWorkEntryRequest): Promise<void> {
    const index = this.items.findIndex(e => e.id === workEntryId)
    if (index === -1) {
      throw new AppError('Registro não encontrado.', 404)
    }

    const entryDate = new Date(data.date).toDateString()
    const duplicate = this.items.find(
      e => e.id !== workEntryId && new Date(e.date).toDateString() === entryDate,
    )
    if (duplicate) {
      throw new AppError('Já existe um registro para esta data.', 409)
    }

    this.items[index] = {
      ...this.items[index]!,
      date: new Date(data.date).toISOString(),
      duration_minutes: data.durationMinutes,
      hourly_rate_at_time: String(data.hourlyRateAtTime),
    }
  }

  async delete(workEntryId: string): Promise<void> {
    const index = this.items.findIndex(e => e.id === workEntryId)
    if (index === -1) {
      throw new AppError('Registro não encontrado.', 404)
    }
    this.items.splice(index, 1)
  }
}
