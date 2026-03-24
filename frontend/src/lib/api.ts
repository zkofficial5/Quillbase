import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("quillbase_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expires or is invalid, clear it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("quillbase_token");
    }
    return Promise.reject(error);
  },
);

export default api;
