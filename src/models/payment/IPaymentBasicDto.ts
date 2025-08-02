import { Decimal } from "@prisma/client/runtime/library"

export interface IPaymentBasicDto {
    id?: number,
    user: {
        id?: number,
        fullName: string,
        email: string,
    },
    amount: Decimal,
    paid_at: Date | null,
    status: {
        name: string
    }
}