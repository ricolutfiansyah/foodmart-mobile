import api from "./api";
import { RegisterResponse, LoginResponse, LogoutResponse, GetMeResponse, AuthPayload } from "../types/auth";
import { BASE_URL } from "../constants/config";

export const authService = {
    register: async (payload: AuthPayload) => {
        const { data } = await api.post<RegisterResponse>(`${BASE_URL}/auth/register`, payload);
        return data;
    },
    login: async (payload: AuthPayload) => {
        const { data } = await api.post<LoginResponse>(`${BASE_URL}/auth/login`, payload);
        return data;
    },
    getMe: async () => {
        const { data } = await api.get<GetMeResponse>(`${BASE_URL}/auth/me`);
        return data;
    },
    logout: async () => {
        const { data } = await api.post<LogoutResponse>(`${BASE_URL}/auth/logout`);
        return data;
    }
}