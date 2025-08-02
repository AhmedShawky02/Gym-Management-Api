import { Decimal } from "@prisma/client/runtime/library";

export interface ITrainerBasicDto {
    id: number;
    bio?: string | null;
    specialization?: string | null;
    experience_years?: number | null;
    user_id?: number | null;
    private_monthly_price: Decimal
} 