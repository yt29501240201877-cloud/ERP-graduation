import axios from "axios";

/**
 * Centralized Axios instance.
 *
 * Security notes:
 * - Base URL comes from an environment variable, never hardcoded,
 *   so staging/production secrets or hosts are not committed to source.
 * - `withCredentials` is left false by default; enable only if the
 *   backend uses cookie-based auth AND CORS is configured to match.
 * - A request timeout prevents hanging calls from freezing the UI.
 * - The response interceptor normalizes errors so components never
 *   need to know about Axios/HTTP internals.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach an auth token if one is present (e.g. after login).
// Token is read from memory/sessionStorage, never hardcoded.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("ap_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected network error";

    // Never leak raw server/stack details to the UI layer.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(`[API Error] ${status ?? "NETWORK"}: ${message}`);
    }

    return Promise.reject({ status, message });
  }
);

export default api;
