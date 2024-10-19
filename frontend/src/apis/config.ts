import axios from "axios";
import { refreshToken } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("🚀 ~ error:", error);
    const originalRequest = error.config;
    if (
      error.response.status === 403 &&
      error.response.data.data.message === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const rfToken = localStorage.getItem("refresh_token");
      const response = await refreshToken(rfToken as string);
      if (response.data.token) {
        localStorage.setItem("access_token", response.data.token);
        api.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.token;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
