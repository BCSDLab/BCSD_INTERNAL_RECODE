import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { ApiError } from "@/types/common";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const isAuthEndpoint = error.config?.url?.startsWith("/v1/auth/");
      if (error.response.status === 401 && !isAuthEndpoint) {
        window.location.href = "/login";
      }
      const apiError: ApiError = error.response.data;
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  },
);
