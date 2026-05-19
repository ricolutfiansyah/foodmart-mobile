import { Food } from "./food";

export interface CartItem {
    id: string;
    cartId: string;
    foodId: string;
    quantity: number;
    food: Food;
    createdAt?: string;
    updatedAt?: string;
}

export interface Cart {
    id?: string;
    userId: string;
    cartItems: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AddToCartPayload {
    foodId: string;
    quantity: number;
}

export interface UpdateCartItemPayload {
    quantity: number;
}