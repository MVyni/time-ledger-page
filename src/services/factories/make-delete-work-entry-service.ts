import { HttpWorkEntryRepository } from '@/repositories/http-work-entry-repository'
import { DeleteWorkEntryService } from '@/services/work-entries/delete-work-entry'
import { httpClient } from '@/lib/http-client'

export function makeDeleteWorkEntryService(): DeleteWorkEntryService {
  const repository = new HttpWorkEntryRepository(httpClient)
  return new DeleteWorkEntryService(repository)
}
