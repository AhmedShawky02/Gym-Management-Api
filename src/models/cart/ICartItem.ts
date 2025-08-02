export interface ICartItem {
    id: number;
    carts: {
        id: number;
        user_id: number;
    };
    product_type: string;
    product_id: number;
    quantity: number;
    created_at: Date | null;
}
