import { Decimal } from "@prisma/client/runtime/library";

export interface IClassDto {
    id: number;
    title: string;
    trainer: {
        trainer_id: number,
        fullName: string
    };
    description: string;
    capacity: number;
    price: Decimal;
    class_date: Date;
    start_time: string;
    end_time: string;
    created_at: Date;
    currentBookingsCount?: number
}
