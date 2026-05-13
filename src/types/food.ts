export interface Food {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    isAvailable: boolean;
    categoryId: string;
    category?: {
        id: string;
        name: string;
    };
}