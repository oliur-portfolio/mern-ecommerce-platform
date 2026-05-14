import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { normalizeAxiosError } from "../utils/normalizeAxiosError";
import { callLogout } from "../utils/authHandler";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosOptions = {
  baseURL: `${baseURL}/api`,
  withCredentials: true,
};

export const axiosPublic = axios.create(axiosOptions);
const refreshClient = axios.create(axiosOptions);
const axiosPrivate = axios.create(axiosOptions);

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

export const setAuthToken = (token: string | null) => {
  accessToken = token;
};

const setAuthorizationHeader = (config: RetryRequestConfig, token: string) => {
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
};

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

const isRefreshRequest = (config?: RetryRequestConfig) => {
  return config?.url?.includes("/auth/refresh-access-token");
};

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeAxiosError(error)),
);

axiosPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      setAuthorizationHeader(config as RetryRequestConfig, accessToken);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (isRefreshRequest(originalRequest)) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401 || !originalRequest) {
      return Promise.reject(normalizeAxiosError(error));
    }

    if (originalRequest._retry) {
      return Promise.reject(normalizeAxiosError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            setAuthorizationHeader(originalRequest, token);
            resolve(axiosPrivate(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshClient.post("/auth/refresh-access-token");
      const newToken = response.data.accessToken as string;

      setAuthToken(newToken);
      processQueue(null, newToken);

      setAuthorizationHeader(originalRequest, newToken);
      return axiosPrivate(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      callLogout();

      return Promise.reject(normalizeAxiosError(refreshError));
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosPrivate;
