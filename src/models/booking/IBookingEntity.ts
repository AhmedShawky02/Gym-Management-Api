import { Decimal } from "@prisma/client/runtime/library";

export interface IBookingEntity {
    id: number;
    user_id: number;
    trainers: {
        id: number;
        private_monthly_price: Decimal,
        users: {
            persons: {
                first_name: string;
                middle_name: string | null;
                last_name: string | null;
            };
        };
    } | null;

    classes: {
        id: number;
        title: string;
        description: string;
        price: Decimal
    } | null;

    booking_date: Date | null;
    status_id: number | null;

    booking_statuses: {
        id: number;
        name: string;
    } | null;
}
