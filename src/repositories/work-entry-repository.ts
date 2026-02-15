import type {
  CreateWorkEntryRequest,
  FetchEntriesResponse,
  FetchHistoryResponse,
} from '@/types'

export interface WorkEntryRepository {
  create(data: CreateWorkEntryRequest): Promise<void>
  list(): Promise<FetchEntriesResponse>
  history(): Promise<FetchHistoryResponse>
  delete(workEntryId: string): Promise<void>
}
