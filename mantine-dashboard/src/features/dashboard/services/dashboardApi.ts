import { apiClient, logApiError } from '@/features/auth/services/authApi';
import { withRetry } from '@/shared/lib/retry';

export type PaginatedResponse<T> = {
  data: T[];
  totalPages: number;
  total: number;
};

export async function fetchPage<T>(
  page: number,
  path: string,
  params = '',
  signal?: AbortSignal,
): Promise<PaginatedResponse<T>> {
  try {
    const query = params ? `&${params}` : '';

    const response = await withRetry(
      () =>
        apiClient.get(`task-monitoring/${path}?page=${page}${query}`, {
          timeout: 30000,
          signal,
        }),
      2,
      500,
    );

    return {
      data: response.data?.data?.data ?? [],
      totalPages: response.data?.data?.last_page ?? 1,
      total: response.data?.data?.total ?? 0,
    };
  } catch (error) {
    logApiError(error);
    return {
      data: [],
      totalPages: 1,
      total: 0,
    };
  }
}
