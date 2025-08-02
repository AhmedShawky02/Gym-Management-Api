import * as UserRepo from "../../../3-DataAccess/user/userRepo.js"
import * as PersonRepo from "../../../3-DataAccess/person/personRepo.js"
import * as UserRoleRepo from "../../../3-DataAccess/userRole/userRoleRepo.js"
import * as RoleRepo from "../../../3-DataAccess/role/roleRepo.js"
import * as TrainerRepo from "../../../3-DataAccess/trainer/adminTrainerRepo.js"
import * as BookingRepo from "../../../3-DataAccess/booking/bookingRepo.js"
import * as PaymentRepo from "../../../3-DataAccess/payment/paymentRepo.js"
import * as ReviewRepo from "../../../3-DataAccess/Review/reviewRepo.js"
import { HttpError } from "../../../utils/HttpError.js";
import { IUsersDto } from "../../../models/user/IUsersDto.js";
import { mapUserAndPersonToDto, mapUserAndTrainerToDto, mapUsesrsAndPersonToDto } from "../../../mapping/userMapper.js";
import { IUserBasicDto } from "../../../models/user/IUserBasicDto.js";
import { IUpdateUserRequest } from "../../../models/user/IUpdateUserRequest.js";
import { IUpdatePersonData } from "../../../models/person/IUpdatePersonData.js";
import { IPersonResult } from "../../../models/person/IPersonResult.js";
import { IUpdateUserData } from "../../../models/user/IUpdateUserData.js";
import { ITrainerDto } from "../../../models/trainer/ITrainerDto.js"
import { IUserFullProfileDto } from "../../../models/user/IUserFullProfileDto.js"
import cloudinary from "../../../config/cloudinaryConfig.js";
import { extractPublicIdFromUrl } from "../../../utils/extractPublicIdFromUrl.js"

export async function getAllUsers(): Promise<IUserBasicDto[]> {
    const users: IUsersDto[] = await UserRepo.getAllUsers();

    if (!users) {
        throw new HttpError("Users not found.", 404)
    }

    const UsersDto: IUserBasicDto[] = mapUsesrsAndPersonToDto(users)
    return UsersDto
}

export async function getUserById(userId: number): Promise<IUserBasicDto | IUserFullProfileDto> {
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("User not found.", 404)
    }

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId);

    if (!trainer) {
        const UserDto: IUserBasicDto = mapUserAndPersonToDto(user)
        return UserDto
    }

    const fullUserDto: IUserFullProfileDto = mapUserAndTrainerToDto(user, trainer);

    return fullUserDto
}

export async function updateUser(Data: IUpdateUserRequest, userId: number, imagePath?: string | undefined): Promise<IUserBasicDto> {
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("User not found.", 404)
    }

    const personData: IUpdatePersonData = {
        first_name: Data.first_name,
        middle_name: Data.middle_name,
        last_name: Data.last_name,
        date_of_birth: Data.date_of_birth,
    };

    if (imagePath && user.profile_picture) {
        const publicId = extractPublicIdFromUrl(user.profile_picture);
        await cloudinary.uploader.destroy(publicId);
    }

    const userData: IUpdateUserData = {
        gender_type_id: Data.gender_type_id,
        profile_picture: imagePath
    }

    const updatedPerson: IPersonResult = await PersonRepo.updatePerson(user.person_id, personData)

    if (!updatedPerson) {
        throw new HttpError("Failed to update person data", 400);
    }

    const UserUpdated: IUsersDto = await UserRepo.updateUser(userData, userId)

    if (!UserUpdated) {
        throw new HttpError("Failed to update User data", 400);
    }

    const UserDto: IUserBasicDto = mapUserAndPersonToDto(UserUpdated)
    return UserDto
}

export async function deleteUser(userId: number) {
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("User not found.", 404)
    }

    const ImageUrl = user.profile_picture

    const person: IPersonResult | null = await PersonRepo.getPersonById(user.person_id)

    if (!person) {
        throw new HttpError("Person not found.", 404)
    }

    const role = await RoleRepo.getRoleByName("User");
    if (!role) {
        throw new HttpError("Role 'User' not found", 404);
    }

    // user_roles
    await UserRoleRepo.deleteUserRoleByUserAndRole(user.id, role.id)

    // refresh_tokens
    await UserRepo.deleteAllTokensByUser(userId);

    // payment
    await PaymentRepo.deletePaymentsByUserId(userId);

    // bookings
    await BookingRepo.deleteBookingsByUserId(userId)

    // review
    await ReviewRepo.deleteReviewsByUserId(userId);

    // user
    await UserRepo.deleteUser(userId)

    // person
    await PersonRepo.deletePerson(user.person_id)

    // image from cloudinary
    if (ImageUrl) {
        const publicId = extractPublicIdFromUrl(ImageUrl);
        await cloudinary.uploader.destroy(publicId);
    }

}