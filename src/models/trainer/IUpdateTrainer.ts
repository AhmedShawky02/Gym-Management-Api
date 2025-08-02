import { Decimal } from "@prisma/client/runtime/library";

export interface IUpdateTrainer {
    bio?: string;
    profile_picture?: string;
    experience_years?: number;
    specialization?: string;
    private_monthly_price: Decimal
} 