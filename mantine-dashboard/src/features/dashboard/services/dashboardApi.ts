import { apiClient } from '@/shared/lib/axios'
import { dashboardSummaryMock } from '../mock/dashboard.mock'

export type DashboardSummary = {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
}

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (useMocks) {
    return Promise.resolve(dashboardSummaryMock)
  }

  const response = await apiClient.get<DashboardSummary>('/dashboard/summary')
  return response.data
}
