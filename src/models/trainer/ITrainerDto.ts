import { Decimal } from "@prisma/client/runtime/library";

export interface ITrainerDto {
    id: number;
    bio: string | null;
    experience_years: number | null;
    specialization: string | null;
    user_id: number | null
    private_monthly_price: Decimal

}
