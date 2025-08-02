import * as ClassRepo from "../../../3-DataAccess/class/classRepo.js";
import * as TrainerRepo from "../../../3-DataAccess/trainer/adminTrainerRepo.js"
import { HttpError } from "../../../utils/HttpError.js";
import { IClassDto } from "../../../models/class/IClassDto.js";
import { ICreateClassRequest } from "../../../models/class/ICreateClassRequest.js";
import { IUpdateClassRequest } from "../../../models/class/IUpdateClassRequest.js";
import { mapClassToDto, mapClassesToDto } from "../../../mapping/classMapper.js";
import { IClassEntity } from "../../../models/class/IClassEntity.js";
import { ITrainerDto } from "../../../models/trainer/ITrainerDto.js";

export async function createClass(classData: ICreateClassRequest, userId: number): Promise<IClassDto> {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        throw new HttpError("Trainer not Found.", 404)
    }

    const price = Number(classData.price);
    if (!isNaN(price) && price < 0) {
        throw new HttpError("Price cannot be less than 0", 400);
    }

    const capacity = Number(classData.capacity);
    if (!isNaN(capacity) && capacity < 0) {
        throw new HttpError("}apacity cannot be less than 0", 400);
    }

    // فحص التاريخ class_date
    const classDate = new Date(classData.class_date);
    if (isNaN(classDate.getTime())) {
        throw new HttpError("Invalid class date", 400);
    }

    // فحص إنه مش في الماضي
    const today = new Date();
    today.setHours(0, 0, 0, 0); // نحذف الوقت من اليوم الحالي ونخليه 00:00:00

    if (classDate < today) {
        throw new HttpError("Class date cannot be in the past", 400);
    }

    // تأكد إن end_time > start_time
    const [startH, startM, startS = "00"] = classData.start_time.split(":").map(Number);
    const [endH, endM, endS = "00"] = classData.end_time.split(":").map(Number);

    const startTotalSeconds = startH * 3600 + startM * 60 + Number(startS);
    const endTotalSeconds = endH * 3600 + endM * 60 + Number(endS);

    if (endTotalSeconds <= startTotalSeconds) {
        throw new HttpError("End time must be after start time", 400);
    }

    const created: IClassEntity = await ClassRepo.createClass(classData, trainer.id);
    const createdDto: IClassDto = mapClassToDto(created);
    return createdDto
}

export async function getMyClasses(userId: number): Promise<IClassDto[]> {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        throw new HttpError("Unauthorized.", 404);
    }

    const classes: IClassEntity[] = await ClassRepo.getClassesByTrainerId(trainer.id);

    if (!classes || classes.length === 0) {
        throw new HttpError("No classes found.", 404);
    }

    return mapClassesToDto(classes);
}

export async function getAllClasses() {
    const classes: IClassEntity[] = await ClassRepo.getAllClasses();

    if (!classes || classes.length === 0) {
        throw new HttpError("No classes found.", 404);
    }

    return mapClassesToDto(classes);
}

export async function getClassById(classId: number, userId: number): Promise<IClassDto> {

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        throw new HttpError("Unauthorized.", 404);
    }

    const classEntity: IClassEntity | null = await ClassRepo.getClassByIdAndTrainer(classId, trainer.id);

    if (!classEntity) {
        throw new HttpError("Class not found.", 404);
    }

    return mapClassToDto(classEntity);
}

export async function getClassToUserById(classId: number) {
    const classEntity: IClassEntity | null = await ClassRepo.getClassById(classId)

    if (!classEntity) {
        throw new HttpError("Class not found.", 404);
    }

    return mapClassToDto(classEntity);
}

export async function updateClass(classData: IUpdateClassRequest, classId: number, userId: number): Promise<IClassDto> {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        throw new HttpError("Unauthorized.", 404);
    }

    const existing: IClassEntity | null = await ClassRepo.getClassByIdAndTrainer(classId, trainer.id);

    if (!existing) {
        throw new HttpError("Class not found.", 404);
    }

    if (classData.price !== undefined) {
        const price = Number(classData.price);
        if (!isNaN(price) && price < 0) {
            throw new HttpError("Price cannot be less than 0", 400);
        }
    }

    if (classData.capacity !== undefined) {
        const capacity = Number(classData.capacity);
        if (!isNaN(capacity) && capacity < 0) {
            throw new HttpError("Capacity cannot be less than 0", 400);
        }
    }

    if (classData.class_date) {
        // فحص التاريخ class_date
        const classDate = new Date(classData.class_date);
        if (isNaN(classDate.getTime())) {
            throw new HttpError("Invalid class date", 400);
        }

        // فحص إنه مش في الماضي
        const today = new Date();
        today.setHours(0, 0, 0, 0); // نحذف الوقت من اليوم الحالي ونخليه 00:00:00

        if (classDate < today) {
            throw new HttpError("Class date cannot be in the past", 400);
        }
    }

    const startTime = classData.start_time ?? existing.start_time;
    const endTime = classData.end_time ?? existing.end_time;

    // تأكد إن end_time > start_time
    const [startH, startM, startS = "00"] = startTime.split(":").map(Number);
    const [endH, endM, endS = "00"] = endTime.split(":").map(Number);

    const startTotalSeconds = startH * 3600 + startM * 60 + Number(startS);
    const endTotalSeconds = endH * 3600 + endM * 60 + Number(endS);

    if (endTotalSeconds <= startTotalSeconds) {
        throw new HttpError("End time must be after start time", 400);
    }


    const updated: IClassEntity = await ClassRepo.updateClass(classData, classId, trainer.id);
    return mapClassToDto(updated);
}

export async function deleteClass(classId: number, userId: number) {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        throw new HttpError("Unauthorized.", 404);
    }


    const existing: IClassEntity | null = await ClassRepo.getClassByIdAndTrainer(classId, trainer.id);

    if (!existing) {
        throw new HttpError("Class not found.", 404);
    }

    await ClassRepo.deleteClass(classId);
}
