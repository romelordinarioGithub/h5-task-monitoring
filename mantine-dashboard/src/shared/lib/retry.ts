import axios from 'axios';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function isRetryableError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  if (error.code === 'ERR_CANCELED') return false;
  if (error.response?.status === 401) return false;

  if (error.code === 'ECONNABORTED') return true;
  if (!error.response) return true;

  const status = error.response.status;
  return status === 429 || status >= 500;
}

export async function withRetry<T>(
  request: () => Promise<T>,
  maxRetries = 2,
  baseDelayMs = 500,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      await wait(baseDelayMs * 2 ** attempt);
    }
  }

  throw lastError;
}
