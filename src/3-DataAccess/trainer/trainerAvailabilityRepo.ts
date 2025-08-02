import prisma from "../../config/prismaClient.js";
import { ITrainerAvailability } from "../../models/trainer/trainerAvailability/ITrainerAvailability.js";
import { ICreateAvailability } from "../../models/trainer/trainerAvailability/ICreateAvailability.js";
import { IUpdateAvailability } from "../../models/trainer/trainerAvailability/IUpdateAvailability.js";
import { IWeekDayDto } from "../../models/trainer/trainerAvailability/IWeekDayDto.js";

export async function getWeekDayById(week_day_id: number): Promise<IWeekDayDto | null> {
    return await prisma.week_days.findUnique({
        where: {
            id: week_day_id
        },
        select: {
            id: true,
            name: true
        }
    })
}

export async function getTrainerAvailabilityForDay(trainerId: number, weekDayId: number): Promise<ITrainerAvailability[]> {
    return prisma.trainer_availability.findMany({
        where: {
            trainer_id: trainerId,
            week_day_id: weekDayId,
        },
        select: {
            id: true,
            trainer_id: true,
            week_day_id: true,
            start_time: true,
            end_time: true,
            created_at: true,
            week_days: {
                select: {
                    id: true,
                    name: true
                }
            }
        }

    });
}

export async function addAvailability(trainerId: number, data: ICreateAvailability): Promise<ITrainerAvailability> {
    return await prisma.trainer_availability.create({
        data: {
            trainer_id: trainerId,
            week_day_id: data.week_day_id,
            start_time: data.start_time,
            end_time: data.end_time
        },
        select: {
            id: true,
            trainer_id: true,
            week_day_id: true,
            start_time: true,
            end_time: true,
            created_at: true,
            week_days: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
}

//----------------------------------------------------------------------


export async function getAvailabilityByTrainerId(trainerId: number): Promise<ITrainerAvailability[]> {
    return await prisma.trainer_availability.findMany({
        where: {
            trainer_id: trainerId
        },
        select: {
            id: true,
            trainer_id: true,
            week_day_id: true,
            start_time: true,
            end_time: true,
            created_at: true,
            week_days: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            week_day_id: 'asc'
        }
    });
}

//----------------------------------------------------------------------


export async function updateAvailability(availabilityId: number, data: IUpdateAvailability): Promise<ITrainerAvailability> {
    return await prisma.trainer_availability.update({
        where: {
            id: availabilityId
        },
        data: {
            ...data
        },
        select: {
            id: true,
            trainer_id: true,
            week_day_id: true,
            start_time: true,
            end_time: true,
            created_at: true,
            week_days: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
    });
}

export async function getAvailabilityById(availabilityId: number): Promise<ITrainerAvailability | null> {
    return await prisma.trainer_availability.findUnique({
        where: {
            id: availabilityId
        },
        select: {
            id: true,
            trainer_id: true,
            week_day_id: true,
            start_time: true,
            end_time: true,
            created_at: true,
            week_days: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
    })
}

export async function deleteAvailability(availabilityId: number) {
    await prisma.trainer_availability.delete({
        where: {
            id: availabilityId
        }
    });
}
