import prisma from "../../config/prismaClient.js";
import { ICreateTrainer } from "../../models/trainer/ICreateTrainer.js";
import { IUpdateTrainer } from "../../models/trainer/IUpdateTrainer.js";
import { ITrainerDto } from "../../models/trainer/ITrainerDto.js";

export async function getAllTrainers(): Promise<ITrainerDto[]> {
    return await prisma.trainers.findMany({
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            user_id: true,
            private_monthly_price: true
        }
    })
}

export async function getTrainerByUserId(userId: number): Promise<ITrainerDto | null> {
    return await prisma.trainers.findUnique({
        where: { user_id: userId },
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            user_id: true,
            private_monthly_price: true
        }
    })
}

export async function getTrainerById(trainerId: number): Promise<ITrainerDto | null> {
    return await prisma.trainers.findUnique({
        where: { id: trainerId },
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            user_id: true,
            private_monthly_price: true
        }
    })
}

export async function createTrainer(data: ICreateTrainer): Promise<ITrainerDto> {
    return await prisma.trainers.create({
        data: {
            ...data,
        },
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            user_id: true,
            private_monthly_price: true
        }
    })
}

export async function updateTrainer(Trainerid: number, data: IUpdateTrainer): Promise<ITrainerDto> {
    return await prisma.trainers.update({
        where: {
            id: Trainerid
        },
        data: {
            ...data
        },
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            user_id: true,
            private_monthly_price: true
        }
    });
}

export async function deleteTrainer(Trainerid: number): Promise<void> {
    await prisma.trainers.delete({
        where: { id: Trainerid },
    });
}

export async function isTrainerExists(userId: number): Promise<boolean> {
    const trainer = await prisma.trainers.findFirst({
        where: {
            user_id: userId
        }
    });

    return !!trainer;
}

export async function updateTrainerByUserId(userId: number, data: IUpdateTrainer): Promise<ITrainerDto> {
    return await prisma.trainers.update({
        where: {
            user_id: userId,
        },
        data: {
            ...data
        },
        select: {
            id: true,
            bio: true,
            experience_years: true,
            specialization: true,
            user_id: true,
            private_monthly_price: true
        }
    })
}