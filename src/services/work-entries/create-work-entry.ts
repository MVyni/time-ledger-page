import type { WorkEntryRepository } from '@/repositories/work-entry-repository'
import type { CreateWorkEntryRequest } from '@/types'

export class CreateWorkEntryService {
  constructor(private workEntryRepository: WorkEntryRepository) {}

  async execute(data: CreateWorkEntryRequest): Promise<void> {
    return this.workEntryRepository.create(data)
  }
}
