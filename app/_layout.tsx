import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../src/store/authStore";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8fafc' }
      }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}