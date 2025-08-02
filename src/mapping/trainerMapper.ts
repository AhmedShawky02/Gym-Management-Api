import { ITrainerBasicDto } from "../models/trainer/ITrainerBasicDto";
import { ITrainerDto } from "../models/trainer/ITrainerDto";

export const mapTrainerAndPersonToDto = (trainer: ITrainerDto): ITrainerBasicDto => {
    return {
        id: trainer.id,
        bio: trainer.bio,
        specialization: trainer.specialization,
        experience_years: trainer.experience_years,
        user_id: trainer.user_id,
        private_monthly_price: trainer.private_monthly_price
    };
};

export const mapTrainersAndPersonToDto = (trainers: ITrainerDto[]): ITrainerBasicDto[] => {
    return trainers.map(mapTrainerAndPersonToDto);
};
