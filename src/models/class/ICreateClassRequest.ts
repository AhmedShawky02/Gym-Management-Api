import { Decimal } from "@prisma/client/runtime/library";

export interface ICreateClassRequest {
    title: string;
    description: string;
    capacity: number;
    price: Decimal;
    class_date: string;
    start_time: string,
    end_time: string
}
