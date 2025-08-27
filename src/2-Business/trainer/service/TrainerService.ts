import * as TrainerRepo from "../../../3-DataAccess/trainer/TrainerRepo.js"
import { mapTrainersAndUserDto } from "../../../mapping/trainerMapper.js";
import { ITrainerAndUserDto } from "../../../models/trainer/ITrainerAndUserDto.js";
import { ITrainersDto } from "../../../models/trainer/ITrainersDto.js";
import { HttpError } from "../../../utils/HttpError.js";

export async function getAllTrainers() : Promise<ITrainerAndUserDto[]> {
    const trainers: ITrainersDto[] = await TrainerRepo.getAllTrainers();

    if (!trainers || trainers.length === 0) {
        throw new HttpError("trainers not found.", 404);
    }

    const trainersDto : ITrainerAndUserDto[] = mapTrainersAndUserDto(trainers);
    return trainersDto;
};