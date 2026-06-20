import axios from "axios";
import { API_URL, TOKEN_KEY } from "../utils/constants";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every outgoing request (if it exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor — handle 401 (unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage
      // (Components/AuthContext handle redirect to login)
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("shopsphere_user");
    }
    return Promise.reject(error);
  }
);

export default api;



