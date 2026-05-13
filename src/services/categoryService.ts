import api from "./api";
import type { Category } from "../types/category";
import type { ApiResponse } from "../types/api";

const CATEGORY_ENDPOINTS = {
    GET_ALL: '/categories',
    GET_BY_ID: '/categories/:id',
} as const

export const categoryService = {
    getAllCategories: async () => {
        const { data } = await api.get<ApiResponse<Category[]>>(CATEGORY_ENDPOINTS.GET_ALL);
        return data;
    },
    getCategoryById: async (id: string) => {
        const endpoint = CATEGORY_ENDPOINTS.GET_BY_ID.replace(":id", id);
        const { data } = await api.get<ApiResponse<Category>>(endpoint);
        return data;
    }
}