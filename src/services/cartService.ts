import api from "./api";
import type { Cart, AddToCartPayload, UpdateCartItemPayload } from "../types/cart";
import type { ApiResponse } from "../types/api";

const CART_ENDPOINTS = {
    GET_CART: '/cart',
    ADD_TO_CART: '/cart',
    UPDATE_CART_ITEM: '/cart/:itemId',
    REMOVE_CART_ITEM: '/cart/:itemId',
    CLEAR_CART: '/cart',
} as const;

export const cartService = {
    getCart: async () => {
        const { data } = await api.get<ApiResponse<Cart>>(CART_ENDPOINTS.GET_CART);
        return data;
    },
    addToCart: async (payload: AddToCartPayload) => {
        const { data } = await api.post<ApiResponse<Cart>>(CART_ENDPOINTS.ADD_TO_CART, payload);
        return data;
    },
    updateCartItem: async (itemId: string, payload: UpdateCartItemPayload) => {
        const endpoint = CART_ENDPOINTS.UPDATE_CART_ITEM.replace(":itemId", itemId);
        const { data } = await api.patch<ApiResponse<Cart>>(endpoint, payload);
        return data;
    },
    removeCartItem: async (itemId: string) => {
        const endpoint = CART_ENDPOINTS.REMOVE_CART_ITEM.replace(":itemId", itemId);
        const { data } = await api.delete<ApiResponse<Cart>>(endpoint);
        return data;
    },
    clearCart: async () => {
        const { data } = await api.delete<ApiResponse<Cart>>(CART_ENDPOINTS.CLEAR_CART);
        return data;
    }
};
