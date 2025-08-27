import { Decimal } from "@prisma/client/runtime/library"

export interface ITrainersDto {
    id: number,
    bio: string,
    experience_years: number,
    specialization: string,
    private_monthly_price: Decimal,
    users: {
        id: number,
        gender_type_id: number,
        profile_picture: string | null,
        persons: {
            first_name: string,
            middle_name: string | null,
            last_name: string | null,
            date_of_birth: Date | null,
        }

    }
}
