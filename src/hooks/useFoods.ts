import { foodService } from "../services/foodService";
import { useQuery } from "@tanstack/react-query";
import { ApiAxiosError, getErrorMessage } from "../types/api";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export const useFoods = (params?: { search?: string, categoryId?: string }) => {
    return useQuery({
        queryKey: ['foods', params],
        queryFn: () => foodService.getAllFoods(params),
        staleTime: 2 * 60 * 1000,
    });
}

export const useFoodById = (id: string) => {
    return useQuery({
        queryKey: ['food', id],
        queryFn: () => foodService.getFoodById(id!),
        staleTime: 1 * 60 * 1000,
        enabled: !!id,
    })
}