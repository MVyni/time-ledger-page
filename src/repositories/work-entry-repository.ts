import type {
  CreateWorkEntryRequest,
  FetchEntriesResponse,
  FetchHistoryResponse,
} from '@/types'

export interface WorkEntryRepository {
  create(data: CreateWorkEntryRequest): Promise<void>
  list(): Promise<FetchEntriesResponse>
  history(): Promise<FetchHistoryResponse>
  update(workEntryId: string, data: CreateWorkEntryRequest): Promise<void>
  delete(workEntryId: string): Promise<void>
}
