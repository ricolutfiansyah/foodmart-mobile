import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../constants/config";
import type { RefreshResponse } from "../types/auth";

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

const REFRESH_URL = `${BASE_URL}/auth/refresh`;

const AUTH_SKIP_URLS = [
    '/auth/register',
    '/auth/login',
    '/auth/refresh',
    '/auth/logout'
] as const;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        const { useAuthStore } = require('@/src/store/authStore');
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

interface QueueItem {
    resolve: (token: string | null) => void;
    reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { useAuthStore } = require('@/src/store/authStore');
        const originalRequest = error.config;

        if (error.response?.status === 401 && !AUTH_SKIP_URLS.some((url) => originalRequest.url?.includes(url)) && !originalRequest._retry) {
            console.log("Token expired! Memulai proses refresh...");
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((error) => Promise.reject(error));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const oldRefreshToken = await SecureStore.getItemAsync('refreshToken');
                const { data } = await axios.post<RefreshResponse>(REFRESH_URL, { refreshToken: oldRefreshToken }, { withCredentials: true });
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;
                if (!newAccessToken) throw new Error('No access token in response');

                useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

                processQueue(null, newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (error: unknown) {
                processQueue(error, null);
                useAuthStore.getState().logout();
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
)

export default api;