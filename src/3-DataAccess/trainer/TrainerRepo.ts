import prisma from "../../config/prismaClient.js";
import { ITrainersDto } from "../../models/trainer/ITrainersDto.js";

export async function getAllTrainers(): Promise<ITrainersDto[]> {
    return await prisma.trainers.findMany({
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            private_monthly_price: true,
            users: {
                select: {
                    id: true,
                    gender_type_id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            date_of_birth: true,
                        }
                    }
                }
            }
        }
    });
}