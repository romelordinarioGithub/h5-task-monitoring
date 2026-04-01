import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/config/env';
import {
  clearAuthStorage,
  clearStoredToken,
  getStoredToken,
  isSessionExpired,
  setStoredToken,
} from '@/features/auth/services/authStorage';

const REQUEST_TIMEOUT_MS = 30000;
const TOKEN_TIMEOUT_MS = 15000;

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let tokenRefreshPromise: Promise<string | null> | null = null;

const activeControllers = new Map<string, AbortController>();

function extractToken(data: any): string | null {
  return (
    data?.data?.token ??
    data?.token ??
    data?.data?.access_token ??
    data?.access_token ??
    null
  );
}

export function logApiError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    console.error('API request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      timeout: error.config?.timeout,
      code: error.code,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return;
  }

  console.error('Unknown API error:', error);
}

async function requestNewToken(): Promise<string | null> {
  try {
    const response = await axios.post(env.apiTokenUrl, null, {
      headers: {
        Accept: 'application/json',
      },
      timeout: TOKEN_TIMEOUT_MS,
    });

    const token = extractToken(response.data);

    if (token) {
      setStoredToken(token);
    }

    return token;
  } catch (error) {
    logApiError(error);
    return null;
  }
}

async function refreshTokenOnce(): Promise<string | null> {
  if (!tokenRefreshPromise) {
    tokenRefreshPromise = requestNewToken().finally(() => {
      tokenRefreshPromise = null;
    });
  }

  return tokenRefreshPromise;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (isSessionExpired()) {
      clearAuthStorage();
      return Promise.reject(new Error('Session expired'));
    }

    let token = getStoredToken();

    if (!token) {
      token = await refreshTokenOnce();
    }

    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    const requestConfig = error.config as RetriableRequestConfig | undefined;

    if (!requestConfig) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !requestConfig._retry) {
      requestConfig._retry = true;

      try {
        clearStoredToken();

        const newToken = await refreshTokenOnce();

        if (!newToken) {
          clearAuthStorage();
          return Promise.reject(error);
        }

        const headers = AxiosHeaders.from(requestConfig.headers);
        headers.set('Authorization', `Bearer ${newToken}`);
        requestConfig.headers = headers;

        return apiClient.request(requestConfig);
      } catch (refreshError) {
        clearAuthStorage();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export function createRequestController(context?: string): AbortController {
  if (!context) {
    return new AbortController();
  }

  if (activeControllers.has(context)) {
    activeControllers.get(context)?.abort();
    activeControllers.delete(context);
  }

  const controller = new AbortController();
  activeControllers.set(context, controller);
  return controller;
}

export function cancelRequests(context: string): void {
  if (activeControllers.has(context)) {
    activeControllers.get(context)?.abort();
    activeControllers.delete(context);
  }
}

export function clearAllRequests(): void {
  activeControllers.forEach((controller) => controller.abort());
  activeControllers.clear();
}
