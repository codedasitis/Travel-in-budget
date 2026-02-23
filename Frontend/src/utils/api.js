import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/user";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem("tb_session") || "null");
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Auto logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("tb_session");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
