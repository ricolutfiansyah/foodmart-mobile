import { create } from "zustand"
import type { User } from "../types/auth";
import { authService } from "../services/authService";
import * as SecureStore from "expo-secure-store";
import { isTokenExpired } from "../utils/expiryCheck";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setTokens: async (accessToken, refreshToken) => {
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        set({ accessToken, isAuthenticated: true });
    },

    login: async (accessToken, refreshToken, user) => {
        await get().setTokens(accessToken, refreshToken);
        set({ user });
        await AsyncStorage.setItem('user', JSON.stringify(user));
    },

    logout: async () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await AsyncStorage.removeItem('user');
    },

    initAuth: async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const savedUser = await AsyncStorage.getItem('user');
            const user = savedUser ? JSON.parse(savedUser) : null;

            if (!refreshToken) return;

            if (accessToken && !isTokenExpired(accessToken)) {
                set({ accessToken, isAuthenticated: true, user });
                return;
            }

            const { data } = await authService.refresh(refreshToken);
            await get().setTokens(data.accessToken, data.refreshToken);
            set({ user });
        } catch (error) {
            get().logout();
        } finally {
            set({ isLoading: false });
        }
    }
}))
