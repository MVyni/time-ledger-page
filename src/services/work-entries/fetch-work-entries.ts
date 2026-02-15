import type { WorkEntryRepository } from '@/repositories/work-entry-repository'
import type { FetchEntriesResponse } from '@/types'

export class FetchWorkEntriesService {
  constructor(private workEntryRepository: WorkEntryRepository) {}

  async execute(): Promise<FetchEntriesResponse> {
    return this.workEntryRepository.list()
  }
}
