import type { ApiResponse } from "./api";

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export type RegisterResponse = ApiResponse<User>;

export type LoginResponse = ApiResponse<AuthResponse>;

export type LogoutResponse = ApiResponse<void>;

export type GetMeResponse = ApiResponse<User>;

export type RefreshResponse = ApiResponse<Pick<AuthResponse, 'accessToken' | 'refreshToken'>>;