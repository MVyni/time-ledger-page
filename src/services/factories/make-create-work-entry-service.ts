import { HttpWorkEntryRepository } from '@/repositories/http-work-entry-repository'
import { CreateWorkEntryService } from '@/services/work-entries/create-work-entry'
import { httpClient } from '@/lib/http-client'

export function makeCreateWorkEntryService(): CreateWorkEntryService {
  const repository = new HttpWorkEntryRepository(httpClient)
  return new CreateWorkEntryService(repository)
}
