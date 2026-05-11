import { create } from "zustand"
import type { User } from "../types/auth";
import { authService } from "../services/authService";
import * as SecureStore from "expo-secure-store";

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAccessToken: (token: string) => void;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setAccessToken: async (token) => {
        await SecureStore.setItemAsync('accessToken', token);
        set({ accessToken: token });
    },

    login: async (token, user) => {
        await SecureStore.setItemAsync('accessToken', token);
        set({ accessToken: token, user, isAuthenticated: true });
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('accessToken');
        set({ accessToken: null, user: null, isAuthenticated: false });
    },

    initAuth: async () => {
        try {
            const currentToken = await SecureStore.getItemAsync('accessToken');
            if (currentToken) {
                const response = await authService.getMe();
                if (response.success && response.data) {
                    set({ accessToken: currentToken, user: response.data, isAuthenticated: true, isLoading: false });
                } else {
                    get().logout();
                }
            }
        } catch (error) {
            get().logout();
        } finally {
            set({ isLoading: false });
        }
    }
}))
