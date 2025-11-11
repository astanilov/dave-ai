const API_BASE_URL = getApiBaseUrl();

// TODO: Some ideas for future enhancements:
// - Redirect to login on HTTP code 401 (Unauthorized).
// - Retry with exponential backoff on HTTP code 500 (Server Error).
async function makeRequest<T = object>(endpoint: string, options?: RequestInit): Promise<T> {
  const apiUrl = joinUrlParts([API_BASE_URL, endpoint]);
  const headers: HeadersInit = {
      'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json() as T;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    return makeRequest<T>(endpoint);
  },

  post: async <T>(endpoint: string, data?: Record<string, unknown>): Promise<T> => {
    return makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || '/api';
}

function joinUrlParts(parts: Array<string>): string {
  return parts.map((x, i) => x.replace(i ? /^\/+|\/+$/g : /\/+$/, '')).join('/');
}
