import { foodService } from "../services/foodService";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { GetAllFoodsParams } from "../types/food";

export const useFoods = (params?: GetAllFoodsParams) => {
    return useInfiniteQuery({
        queryKey: ['foods', params],
        queryFn: ({ pageParam }) => foodService.getAllFoods({ ...params, page: pageParam }),
        staleTime: 2 * 60 * 1000,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta?.hasNextPage ? lastPage.meta.currentPage + 1 : undefined;
        }
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