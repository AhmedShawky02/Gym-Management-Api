import { Decimal } from "@prisma/client/runtime/library";

export interface IBookingBasicDto {
    id: number;
    user_id: number;
    booking_date: Date;
    status: {
        id: number;
        name: string;
    } | null;
    trainer?: {
        fullName: string;
        private_monthly_price: Decimal
    };
    class?: {
        id: number;
        title: string;
        description: string;
    };
}