import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import type { AddToCartPayload, UpdateCartItemPayload, Cart } from "../types/cart";
import type { ApiAxiosError, ApiResponse } from "../types/api";

export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => cartService.getCart(),
        staleTime: 1 * 60 * 1000,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<Cart>, ApiAxiosError, AddToCartPayload, { previousCart: ApiResponse<Cart> | undefined }>({
        mutationFn: (payload) => cartService.addToCart(payload),
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });

            const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);

            if (previousCart) {
                const existingItem = previousCart.data.cartItems.find(item => item.foodId === payload.foodId);

                if (existingItem) {
                    queryClient.setQueryData<ApiResponse<Cart>>(['cart'], {
                        ...previousCart,
                        data: {
                            ...previousCart.data,
                            cartItems: previousCart.data.cartItems.map(item =>
                                item.foodId === payload.foodId
                                    ? { ...item, quantity: item.quantity + payload.quantity }
                                    : item
                            )
                        }
                    });
                }
            }

            return { previousCart };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<Cart>, ApiAxiosError, { itemId: string; payload: UpdateCartItemPayload }, { previousCart: ApiResponse<Cart> | undefined }>({
        mutationFn: ({ itemId, payload }) => cartService.updateCartItem(itemId, payload),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);

            return { previousCart };
        },
        onError: (_err, { itemId }, context) => {
            const currentCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);
            const itemStillExists = currentCart?.data.cartItems.some(i => i.id === itemId);

            if (context?.previousCart && itemStillExists) {
                queryClient.setQueryData(['cart'], context.previousCart);
            }
        },
        onSettled: (_data, _err, { itemId }) => {
            const currentCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);
            const itemStillExists = currentCart?.data.cartItems.some(i => i.id === itemId);
            if (itemStillExists) {
                queryClient.invalidateQueries({ queryKey: ['cart'] });
            }
        }
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<Cart>, ApiAxiosError, string, { previousCart: ApiResponse<Cart> | undefined }>({
        mutationFn: (itemId) => cartService.removeCartItem(itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);

            if (previousCart) {
                queryClient.setQueryData<ApiResponse<Cart>>(['cart'], {
                    ...previousCart,
                    data: {
                        ...previousCart.data,
                        cartItems: previousCart.data.cartItems.filter(item => item.id !== itemId)
                    }
                });
            }

            return { previousCart };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<Cart>, ApiAxiosError, void, { previousCart: ApiResponse<Cart> | undefined }>({
        mutationFn: () => cartService.clearCart(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);

            if (previousCart) {
                queryClient.setQueryData<ApiResponse<Cart>>(['cart'], {
                    ...previousCart,
                    data: {
                        ...previousCart.data,
                        cartItems: []
                    }
                });
            }

            return { previousCart };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};
