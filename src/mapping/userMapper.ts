import { ITrainerDto } from "../models/trainer/ITrainerDto";
import { IUserBasicDto } from "../models/user/IUserBasicDto";
import { IUserDto } from "../models/user/IUserDto";
import { IUserFullProfileDto } from "../models/user/IUserFullProfileDto";
import { IUsersDto } from "../models/user/IUsersDto";
import { UserWithPersonAndRoles } from "../models/user/UserWithPersonAndRoles";

export const mapUserWithPersonAndRolesToDto = (user: UserWithPersonAndRoles): IUserDto => {
    return {
        id: user.id,
        fullName: user.persons.first_name + " " + user.persons.middle_name + " " + user.persons.last_name,
        email: user.email,
        createdDate: user.persons.created_at?.toISOString() ?? null,
        gender: user.gender_type_id === 1 ? "male" : "female",
        profile_picture: user.profile_picture ?? " ",
        date_of_birth: user.persons.date_of_birth,
        roles: user.user_roles?.map(ur => ur.roles?.name ?? "") ?? [],
    }
}

export const mapUsesrsAndPersonToDto = (users: IUsersDto[]): IUserBasicDto[] => {
    return users.map(user => ({
        id: user.id,
        fullName: user.persons.first_name + " " + user.persons.middle_name + " " + user.persons.last_name,
        email: user.email,
        createdDate: user.persons.created_at?.toISOString() ?? null,
        profile_picture: user.profile_picture ?? " ",
        gender: user.gender_type_id === 1 ? "male" : "female",
        date_of_birth: user.persons.date_of_birth,
    }))
}

export const mapUserAndPersonToDto = (user: IUsersDto): IUserBasicDto => {
    return {
        id: user.id,
        fullName: user.persons.first_name + " " + user.persons.middle_name + " " + user.persons.last_name,
        email: user.email,
        createdDate: user.persons.created_at?.toISOString() ?? null,
        profile_picture: user.profile_picture ?? " ",
        date_of_birth: user.persons.date_of_birth,
        gender: user.gender_type_id === 1 ? "male" : "female",
    }
}

export const mapUserAndTrainerToDto = (user: IUsersDto, trainer: ITrainerDto): IUserFullProfileDto => {
    return {
        id: user.id,
        fullName: user.persons.first_name + " " + user.persons.middle_name + " " + user.persons.last_name,
        email: user.email,
        createdDate: user.persons.created_at?.toISOString() ?? null,
        profile_picture: user.profile_picture ?? " ",
        gender: user.gender_type_id === 1 ? "male" : "female",
        date_of_birth: user.persons.date_of_birth,
        trainerInfo: trainer ? {
            trainer_Id: trainer.id,
            bio: trainer.bio,
            specialization: trainer.specialization,
            experience_years: trainer.experience_years,
            private_monthly_price: trainer.private_monthly_price
        } : undefined
    }
}