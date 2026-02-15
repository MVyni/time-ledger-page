export interface WorkEntry {
  id: string
  date: string
  durationMinutes: number
  hourlyRate: number
  saved: boolean
}

export interface WorkEntryApiResponse {
  id: string
  date: string
  duration_minutes: number
  hourly_rate_at_time: string | number
  user_id: string
}

export interface CreateWorkEntryRequest {
  date: string
  durationMinutes: number
  hourlyRateAtTime: number
}

export interface FetchEntriesResponse {
  entries: WorkEntryApiResponse[]
}

export interface MonthlyHistory {
  month: number
  year: number
  totalMinutes: number
  totalEarnings: number
}

export interface FetchHistoryResponse {
  monthlyHistory: MonthlyHistory[]
}
