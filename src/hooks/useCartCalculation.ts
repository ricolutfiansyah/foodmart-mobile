import { useMemo } from 'react';
import type { CartItem } from '@/src/types/cart';

export const useCartCalculations = (cartItems: CartItem[]) => {
    return useMemo(() => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (Number(item.food.price) * item.quantity),
            0
        );
        const deliveryFee = cartItems.length > 0 ? 10000 : 0;
        const total = subtotal + deliveryFee;
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        return { subtotal, deliveryFee, total, itemCount };
    }, [cartItems]);
};