import api from "./api";
import { RegisterResponse, LoginResponse, LogoutResponse, GetMeResponse, AuthPayload, RefreshResponse } from "../types/auth";
import { BASE_URL } from "../constants/config";
import axios from "axios";

export const authService = {
    register: async (payload: AuthPayload) => {
        const { data } = await api.post<RegisterResponse>(`${BASE_URL}/auth/register`, payload);
        return data;
    },
    login: async (payload: AuthPayload) => {
        const { data } = await api.post<LoginResponse>(`${BASE_URL}/auth/login`, payload);
        return data;
    },
    refresh: async (refreshToken: string) => {
        const { data } = await axios.post<RefreshResponse>(`${BASE_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });
        return data;
    },
    getMe: async () => {
        const { data } = await api.get<GetMeResponse>(`${BASE_URL}/auth/me`);
        return data;
    },
    logout: async (refreshToken: string) => {
        const { data } = await api.post<LogoutResponse>(`${BASE_URL}/auth/logout`, { refreshToken });
        return data;
    }
}