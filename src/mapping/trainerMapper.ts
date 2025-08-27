import { ITrainerAndUserDto } from "../models/trainer/ITrainerAndUserDto";
import { ITrainerBasicDto } from "../models/trainer/ITrainerBasicDto";
import { ITrainerDto } from "../models/trainer/ITrainerDto";
import { ITrainersDto } from "../models/trainer/ITrainersDto";

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

export const mapTrainerAndUserDto = (trainer: ITrainersDto): ITrainerAndUserDto => {
    return {
        id: trainer.id,
        bio: trainer.bio,
        specialization: trainer.specialization,
        experience_years: trainer.experience_years,
        private_monthly_price: trainer.private_monthly_price,
        user: {
            id: trainer.users.id,
            name: trainer.users.persons.first_name + " " + trainer.users.persons.middle_name + " " + trainer.users.persons.last_name,
            date_of_birth: trainer.users.persons.date_of_birth,
            gender: trainer.users.gender_type_id === 1 ? "male" : "female",
            profile_picture: trainer.users.profile_picture,
        },
    };
}

export const mapTrainersAndUserDto = (trainers: ITrainersDto[]): ITrainerAndUserDto[] => {
    return trainers.map(mapTrainerAndUserDto);
}
