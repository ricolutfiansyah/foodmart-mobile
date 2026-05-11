import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/authStore";
import type { AuthPayload } from "../types/auth";
import { ApiAxiosError, getErrorMessage } from "../types/api";

export const useAuth = () => {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (payload: AuthPayload) => authService.login(payload),
        onSuccess: ({ data }) => {
            useAuthStore.getState().login(data.accessToken, data.user);
            router.replace("/(tabs)/home");
        },
        onError: (error: ApiAxiosError) => {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                return;
            }
            Toast.show({
                type: 'info',
                text1: getErrorMessage(error)
            });
        }
    });

    const registerMutation = useMutation({
        mutationFn: (payload: AuthPayload) => authService.register(payload),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Register berhasil',
            });
            router.replace('/');
        },
        onError: (error: ApiAxiosError) => {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                return;
            }
            Toast.show({
                type: 'info',
                text1: getErrorMessage(error)
            });
        }
    });

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            useAuthStore.getState().logout();
            router.replace("/");
        },
        onError: () => {
            Toast.show({
                type: 'error',
                text1: 'Logout failed'
            });
        }
    });

    return {
        handleLogin: loginMutation.mutate,
        isLoginLoading: loginMutation.isPending,
        loginErrors: loginMutation.error,

        handleRegister: registerMutation.mutate,
        isRegisterLoading: registerMutation.isPending,
        registerErrors: registerMutation.error,

        handleLogout: logoutMutation.mutate,
        isLogoutLoading: logoutMutation.isPending,

    }
}

