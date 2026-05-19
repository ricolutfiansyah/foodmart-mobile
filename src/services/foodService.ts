import api from "./api";
import type { Food } from "../types/food";
import type { ApiResponse } from "../types/api";
import type { GetAllFoodsParams } from "../types/food";

const FOODS_ENDPOINTS = {
    GET_ALL: '/foods',
    GET_BY_ID: '/foods/:id',
    CREATE: '/foods',
    UPDATE: '/foods/:id',
    DELETE: '/foods/:id',
} as const

export const foodService = {
    getAllFoods: async (params?: GetAllFoodsParams) => {
        const { data } = await api.get<ApiResponse<Food[]>>(FOODS_ENDPOINTS.GET_ALL, { params });
        return data;
    },
    getFoodById: async (id: string) => {
        const endpoint = FOODS_ENDPOINTS.GET_BY_ID.replace(":id", id);
        const { data } = await api.get<ApiResponse<Food>>(endpoint);
        return data;
    }
}
