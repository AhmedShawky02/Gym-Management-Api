import * as TrainerRepo from '../../../3-DataAccess/trainer/adminTrainerRepo.js';
import * as UserRoleRepo from "../../../3-DataAccess/userRole/userRoleRepo.js"
import * as UserRepo from "../../../3-DataAccess/user/userRepo.js"
import * as RoleRepo from "../../../3-DataAccess/role/roleRepo.js"
import { HttpError } from '../../../utils/HttpError.js';
import { ITrainerBasicDto } from '../../../models/trainer/ITrainerBasicDto.js';
import { IUpdateTrainer } from '../../../models/trainer/IUpdateTrainer.js';
import { ICreateTrainer } from '../../../models/trainer/ICreateTrainer.js';
import { mapTrainerAndPersonToDto, mapTrainersAndPersonToDto } from '../../../mapping/trainerMapper.js';
import { IUsersDto } from '../../../models/user/IUsersDto.js';
import { ITrainerDto } from '../../../models/trainer/ITrainerDto.js';
import { IUserRoleDto } from '../../../models/userRole/IUserRoleDto.js';


export async function addTrainer(trainerData: ICreateTrainer): Promise<ITrainerBasicDto> {

    if (!trainerData.user_id) {
        throw new HttpError("user_id is required.", 400);
    }

    const user: IUsersDto | null = await UserRepo.getUserById(trainerData.user_id)
    if (!user) {
        throw new HttpError("User not found.", 404);
    }

    const existingTrainer = await TrainerRepo.isTrainerExists(trainerData.user_id);
    if (existingTrainer) {
        throw new HttpError("This user is already registered as a trainer.", 400);
    }

    const role = await RoleRepo.getRoleByName("Trainer");
    if (!role) {
        throw new HttpError("Role 'Trainer' not found", 404);
    }

    const existingUserRole: IUserRoleDto | null = await UserRoleRepo.findUserRole(user.id, role.id);
    if (existingUserRole) {
        throw new HttpError("This user already has this role assigned.", 400);
    }

    if (Number(trainerData.private_monthly_price) < 0) {
        throw new HttpError("Monthly private training price cannot be negative.", 400);
    }

    const trainer: ITrainerDto = await TrainerRepo.createTrainer(trainerData)

    if (!trainer) {
        throw new HttpError("Failed to create trainer. Please try again later.", 500);
    }

    await UserRoleRepo.assignRoleToUser(user.id, role.id);

    const trainerDto: ITrainerBasicDto = mapTrainerAndPersonToDto(trainer)

    return trainerDto
}

export async function getAllTrainers(): Promise<ITrainerBasicDto[]> {
    const trainers: ITrainerDto[] = await TrainerRepo.getAllTrainers();

    if (!trainers || trainers.length === 0) {
        throw new HttpError("trainers not found.", 404);
    }

    return mapTrainersAndPersonToDto(trainers);
}

export async function getTrainerByUserId(userId: number): Promise<ITrainerBasicDto> {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        throw new HttpError('Trainer not found.', 404);
    }

    return mapTrainerAndPersonToDto(trainer);
}

export async function updateTrainer(trainerData: IUpdateTrainer, trainerId: number): Promise<ITrainerBasicDto> {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerById(trainerId)

    if (!trainer) {
        throw new HttpError("Trainer not found.", 404);
    }

    const updated: ITrainerDto = await TrainerRepo.updateTrainer(trainerId, trainerData)

    const updatedDto = mapTrainerAndPersonToDto(updated)

    return updatedDto
}

export async function deleteTrainer(trainerId: number) {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerById(trainerId)
    if (!trainer) {
        throw new HttpError("Trainer not found.", 404);
    }

    const role = await RoleRepo.getRoleByName("Trainer");
    if (!role) {
        throw new HttpError("Role 'Trainer' not found", 404);
    }

    await UserRoleRepo.deleteUserRoleByUserAndRole(trainer.user_id!, role.id)

    await TrainerRepo.deleteTrainer(trainerId)
}

export async function updateTrainerByUserId(trainerData: IUpdateTrainer, userId: number) {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Trainer not found.", 404);
    }

    const updated: ITrainerDto = await TrainerRepo.updateTrainerByUserId(userId, trainerData)

    const updatedDto = mapTrainerAndPersonToDto(updated)

    return updatedDto

}