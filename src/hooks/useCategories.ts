import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAllCategories(),
        staleTime: 2 * 60 * 1000,
    });
}

export const useCategoryById = (id: string) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: () => categoryService.getCategoryById(id!),
        staleTime: 1 * 60 * 1000,
        enabled: !!id,
    });
}