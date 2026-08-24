import axios from "axios";
import { API_BASE_URL } from "@/config/api.config";

// Kept out of React state so the interceptor can read/clear it without
// importing the context (avoids a circular dependency). AuthContext is
// the single writer of localStorage; this is just a reader for headers.
const TOKEN_KEY = "shopcart_auth";

function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single place other modules can subscribe to for "session expired"
// so the UI can redirect + toast without every caller handling 401 itself.
const sessionListeners = new Set();
export function onSessionExpired(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function friendlyErrorMessage(error) {
  if (!error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }
  const status = error.response.status;
  const backendMessage = error.response.data?.message || error.response.data?.error;

  switch (status) {
    case 400:
      return backendMessage || "That request wasn't valid. Please check the details and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 500:
      return "Something went wrong. Please try again.";
    default:
      return backendMessage || "Something went wrong. Please try again.";
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      sessionListeners.forEach((listener) => listener());
    }
    error.friendlyMessage = friendlyErrorMessage(error);
    return Promise.reject(error);
  }
);

export const AUTH_STORAGE_KEY = TOKEN_KEY;
export default axiosClient;
