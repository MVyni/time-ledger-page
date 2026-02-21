import { HttpWorkEntryRepository } from '@/repositories/http-work-entry-repository'
import { UpdateWorkEntryService } from '@/services/work-entries/update-work-entry'
import { httpClient } from '@/lib/http-client'

export function makeUpdateWorkEntryService(): UpdateWorkEntryService {
  const repository = new HttpWorkEntryRepository(httpClient)
  return new UpdateWorkEntryService(repository)
}
