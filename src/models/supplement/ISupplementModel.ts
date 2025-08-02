import { Decimal } from "@prisma/client/runtime/library";

export interface ISupplementModel {
    id: number,
    name: string,
    description: string,
    image_url: string,
    capacity: number,
    price: Decimal,
    created_at: Date | null;
}