import type { WorkEntryRepository } from '@/repositories/work-entry-repository'

export class DeleteWorkEntryService {
  constructor(private workEntryRepository: WorkEntryRepository) {}

  async execute(workEntryId: string): Promise<void> {
    return this.workEntryRepository.delete(workEntryId)
  }
}
