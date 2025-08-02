import * as AvailabilityRepo from "../../../3-DataAccess/trainer/trainerAvailabilityRepo.js";
import * as TrainerRepo from "../../../3-DataAccess/trainer/adminTrainerRepo.js"
import { HttpError } from "../../../utils/HttpError.js";
import { ITrainerAvailabilityDto } from "../../../models/trainer/trainerAvailability/ITrainerAvailabilityDto.js";
import { ICreateAvailability } from "../../../models/trainer/trainerAvailability/ICreateAvailability.js";
import { IUpdateAvailability } from "../../../models/trainer/trainerAvailability/IUpdateAvailability.js";
import { mapTrainerAvailabilitiesToDto, mapTrainerAvailabilityToDto } from "../../../mapping/trainerAvailabilityMapper.js";
import { ITrainerDto } from "../../../models/trainer/ITrainerDto.js";
import { IWeekDayDto } from "../../../models/trainer/trainerAvailability/IWeekDayDto.js";
import { ITrainerAvailability } from "../../../models/trainer/trainerAvailability/ITrainerAvailability.js";

export async function addAvailability(userId: number, data: ICreateAvailability): Promise<ITrainerAvailabilityDto> {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Unauthorized.", 401);
    }

    //----------------------------------------------------------------------

    // تأكد إن end_time > start_time
    const [startH, startM, startS = "00"] = data.start_time.split(":").map(Number);
    const [endH, endM, endS = "00"] = data.end_time.split(":").map(Number);

    const startTotalSeconds = startH * 3600 + startM * 60 + Number(startS);
    const endTotalSeconds = endH * 3600 + endM * 60 + Number(endS);

    if (endTotalSeconds <= startTotalSeconds) {
        throw new HttpError("End time must be after start time", 400);
    }

    //----------------------------------------------------------------------

    const week_day_id: IWeekDayDto | null = await AvailabilityRepo.getWeekDayById(data.week_day_id)

    if (!week_day_id) {
        throw new HttpError("Week_Day not Found.", 400);
    }

    //----------------------------------------------------------------------

    // استرجاع كل الفترات لنفس المدرب في نفس اليوم
    const existingAvailabilities: ITrainerAvailability[] = await AvailabilityRepo.getTrainerAvailabilityForDay(trainer.id, data.week_day_id);

    // التحقق من التداخل
    for (const availability of existingAvailabilities) {
        const [oldStartH, oldStartM, oldStartS = "00"] = availability.start_time.split(":").map(Number);
        const [oldEndH, oldEndM, oldEndS = "00"] = availability.end_time.split(":").map(Number);

        const oldStart = oldStartH * 3600 + oldStartM * 60 + Number(oldStartS);
        const oldEnd = oldEndH * 3600 + oldEndM * 60 + Number(oldEndS);

        const noOverlap = endTotalSeconds <= oldStart || startTotalSeconds >= oldEnd;

        if (!noOverlap) {
            throw new HttpError("Time range overlaps with an existing availability", 400);
        }
    }

    //----------------------------------------------------------------------

    const created = await AvailabilityRepo.addAvailability(trainer.id, data);
    if (!created) {
        throw new HttpError("Failed to create availability.", 400);
    }

    const dto: ITrainerAvailabilityDto = mapTrainerAvailabilityToDto(created);
    return dto;
}

export async function getMyAvailability(userId: number): Promise<ITrainerAvailabilityDto[]> {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Unauthorized.", 401);
    }

    const availabilities: ITrainerAvailability[] = await AvailabilityRepo.getAvailabilityByTrainerId(trainer.id);

    if (!availabilities || availabilities.length === 0) {
        throw new HttpError("availabilities not found.", 400);
    }

    const dto: ITrainerAvailabilityDto[] = mapTrainerAvailabilitiesToDto(availabilities);
    return dto;
}

export async function updateAvailability(userId: number, availabilityId: number, data: IUpdateAvailability): Promise<ITrainerAvailabilityDto> {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Unauthorized.", 401);
    }

    const availability: ITrainerAvailability | null = await AvailabilityRepo.getAvailabilityById(availabilityId);

    if (!availability) {
        throw new HttpError("Availability not found.", 404);
    }

    //----------------------------------------------------------------------

    const startTime = data.start_time ?? availability.start_time;
    const endTime = data.end_time ?? availability.end_time;

    const [startH, startM, startS = "00"] = startTime.split(":").map(Number);
    const [endH, endM, endS = "00"] = endTime.split(":").map(Number);

    const startTotalSeconds = startH * 3600 + startM * 60 + Number(startS);
    const endTotalSeconds = endH * 3600 + endM * 60 + Number(endS);

    if (endTotalSeconds <= startTotalSeconds) {
        throw new HttpError("End time must be after start time", 400);
    }

    //----------------------------------------------------------------------

    if (availability.week_days?.id) {
        // استرجاع كل الفترات لنفس المدرب في نفس اليوم
        const existingAvailabilities: ITrainerAvailability[] = await AvailabilityRepo.getTrainerAvailabilityForDay(trainer.id, availability.week_days?.id);

        // التحقق من التداخل
        for (const availability of existingAvailabilities) {

            if (availability.id === availabilityId) continue; // تجاهل الـ availability اللي بنعدله

            const [oldStartH, oldStartM, oldStartS = "00"] = availability.start_time.split(":").map(Number);
            const [oldEndH, oldEndM, oldEndS = "00"] = availability.end_time.split(":").map(Number);

            const oldStart = oldStartH * 3600 + oldStartM * 60 + Number(oldStartS);
            const oldEnd = oldEndH * 3600 + oldEndM * 60 + Number(oldEndS);

            const noOverlap = endTotalSeconds <= oldStart || startTotalSeconds >= oldEnd;

            if (!noOverlap) {
                throw new HttpError("Time range overlaps with an existing availability", 400);
            }
        }
    }

    //----------------------------------------------------------------------

    if (data.week_day_id) {
        const week_day_id: IWeekDayDto | null = await AvailabilityRepo.getWeekDayById(data.week_day_id)

        if (!week_day_id) {
            throw new HttpError("Week_Day not Found.", 400);
        }
    }

    //----------------------------------------------------------------------


    const updated = await AvailabilityRepo.updateAvailability(availabilityId, data);
    if (!updated) {
        throw new HttpError("Failed to update availability.", 400);
    }

    const dto: ITrainerAvailabilityDto = mapTrainerAvailabilityToDto(updated);
    return dto;
}

export async function deleteAvailability(userId: number, availabilityId: number) {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Unauthorized.", 401);
    }

    const availability: ITrainerAvailability | null = await AvailabilityRepo.getAvailabilityById(availabilityId);

    if (!availability) {
        throw new HttpError("Availability not found.", 404);
    }

    if (availability.trainer_id !== trainer.id) {
        throw new HttpError("You are not authorized to delete this availability.", 403);
    }

    await AvailabilityRepo.deleteAvailability(availabilityId);
}

export async function getAvailabilityByTrainerId(trainerId: number) {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerById(trainerId)

    if (!trainer) {
        throw new HttpError("Trainer not found.", 401);
    }

    const availabilities: ITrainerAvailability[] = await AvailabilityRepo.getAvailabilityByTrainerId(trainer.id);

    if (!availabilities || availabilities.length === 0) {
        throw new HttpError("availabilities not found.", 400);
    }

    const dto: ITrainerAvailabilityDto[] = mapTrainerAvailabilitiesToDto(availabilities);
    return dto;

}
