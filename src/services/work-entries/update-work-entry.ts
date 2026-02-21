import type { WorkEntryRepository } from '@/repositories/work-entry-repository'
import type { CreateWorkEntryRequest } from '@/types'

export class UpdateWorkEntryService {
  constructor(private workEntryRepository: WorkEntryRepository) {}

  async execute(workEntryId: string, data: CreateWorkEntryRequest): Promise<void> {
    return this.workEntryRepository.update(workEntryId, data)
  }
}
