import { Decimal } from "@prisma/client/runtime/library";

export interface ICreatePayment {
    id: number,
    user_id: number,
    package_id: number | null,
    booking_id: number | null,
    cart_id: number | null,
    amount: Decimal,
    status_id: number,
    paymob_order_id: number | null,
    paid_at: Date | null,
}
