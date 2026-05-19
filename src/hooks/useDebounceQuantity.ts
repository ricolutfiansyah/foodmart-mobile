import { useRef, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateCartItem } from '@/src/hooks/useCart';
import type { ApiResponse } from '@/src/types/api';
import type { Cart, CartItem } from '@/src/types/cart';

const DEBOUNCE_DELAY = 500;

export function useDebounceQuantity() {
    const queryClient = useQueryClient();

    const { mutate: updateCartItem } = useUpdateCartItem();
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(clearTimeout);
            timers.current = {};
        };
    }, [])

    const updateCacheQuantity = useCallback((itemId: string, delta: number) => {
        queryClient.setQueryData<ApiResponse<Cart>>(['cart'], (old) => {
            if (!old) return old;
            return {
                ...old,
                data: {
                    ...old.data,
                    cartItems: old.data.cartItems.map((i) =>
                        i.id === itemId
                            ? { ...i, quantity: i.quantity + delta }
                            : i
                    ),
                },
            };
        });
    }, [queryClient]);

    const scheduleRequest = useCallback((itemId: string) => {
        clearTimeout(timers.current[itemId]);
        timers.current[itemId] = setTimeout(() => {
            const currentCart = queryClient.getQueryData<ApiResponse<Cart>>(['cart']);
            const currentItem = currentCart?.data.cartItems.find((i) => i.id === itemId);
            if (currentItem) {
                updateCartItem({
                    itemId,
                    payload: { quantity: currentItem.quantity },
                });
            }
            delete timers.current[itemId];
        }, DEBOUNCE_DELAY);
    }, [queryClient, updateCartItem]);

    const handleIncrease = useCallback((item: CartItem) => {
        updateCacheQuantity(item.id, +1);
        scheduleRequest(item.id);
    }, [updateCacheQuantity, scheduleRequest]);

    const handleDecrease = useCallback((item: CartItem) => {
        updateCacheQuantity(item.id, -1);
        scheduleRequest(item.id);
    }, [updateCacheQuantity, scheduleRequest]);

    const cancelPendingUpdate = useCallback((itemId: string) => {
        if (timers.current[itemId]) {
            clearTimeout(timers.current[itemId]);
            delete timers.current[itemId];
        }
    }, []);

    return { handleIncrease, handleDecrease, cancelPendingUpdate };
}