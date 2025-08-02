import { Decimal } from "@prisma/client/runtime/library";

export interface IPaymentsDb {
    id:number,
    users: {
        id?: number,
        email: string,
        persons: {
            first_name: string | null,
            last_name: string | null,
        }
    },
    amount: Decimal,
    paid_at: Date | null,
    payment_statuses: {
        name: string,
    },
}