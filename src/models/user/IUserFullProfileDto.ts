import { Decimal } from "@prisma/client/runtime/library";

export interface IUserFullProfileDto {
    id: number;
    fullName: string;
    email: string;
    createdDate: string | null;
    gender: string;
    profile_picture?: string;
    date_of_birth: Date | null
    trainerInfo?: {
        trainer_Id: number;
        bio: string | null;
        specialization: string | null;
        experience_years: number | null;
        private_monthly_price: Decimal
    };
}
