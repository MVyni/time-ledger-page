import { HttpWorkEntryRepository } from '@/repositories/http-work-entry-repository'
import { FetchWorkEntriesService } from '@/services/work-entries/fetch-work-entries'
import { httpClient } from '@/lib/http-client'

export function makeFetchWorkEntriesService(): FetchWorkEntriesService {
  const repository = new HttpWorkEntryRepository(httpClient)
  return new FetchWorkEntriesService(repository)
}
