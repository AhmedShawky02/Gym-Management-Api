import { Decimal } from "@prisma/client/runtime/library";

export interface ICreateTrainer {
    user_id: number;
    bio: string;
    experience_years: number;
    specialization: string;
    private_monthly_price: Decimal
} 