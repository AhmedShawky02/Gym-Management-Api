export interface ICreatePaymentItem {
    payment_id: number;
    product_type: string;
    product_id: number;
    quantity: number;
    price_snapshot: number;
}
