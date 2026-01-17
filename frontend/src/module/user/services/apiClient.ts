export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("API Config:", { BASE_URL });

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log(`Making request to: ${url}`);

  // Get token from localStorage (Zustand persist)
  const userStorage = localStorage.getItem("user-storage");
  const vendorStorage = localStorage.getItem("vendor-storage");
  const adminStorage = localStorage.getItem("admin-storage-v2");

  let token = null;

  // Logic to determine which token to use
  if (path.startsWith("/admin")) {
    token = adminStorage ? JSON.parse(adminStorage).state.token : null;
  } else if (path.startsWith("/vendor")) {
    token = vendorStorage ? JSON.parse(vendorStorage).state.token : null;
    if (!token && userStorage) {
      token = JSON.parse(userStorage).state.token;
    }
  } else {
    // Default to user token, fallback to vendor token
    token = userStorage ? JSON.parse(userStorage).state.token : null;
    if (!token && vendorStorage) {
      token = JSON.parse(vendorStorage).state.token;
    }
  }

  try {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`, {
        statusText: response.statusText,
        url: url,
      });
      const error = await response
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
