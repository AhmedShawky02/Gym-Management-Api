import * as authRepo from "../../../3-DataAccess/user/authRepo.js"
import * as PersonRepo from "../../../3-DataAccess/person/personRepo.js"
import { ICreateUser } from '../../../models/user/ICreateUser.js';
import { ICreatePerson } from "../../../models/person/ICreatePerson.js";
import * as UserHelper from "../../../utils/hashingPassword.js"
import { HttpError } from "../../../utils/HttpError.js";
import * as clientType from "@prisma/client";
import { mapUserWithPersonAndRolesToDto } from "../../../mapping/userMapper.js";
import { IUserDto } from "../../../models/user/IUserDto.js";
import jwt from "jsonwebtoken";
import { UserWithPersonAndRoles } from "../../../models/user/UserWithPersonAndRoles.js";

/* 
    first_name: string,
    middle_name: string,
    last_name: string,
    date_of_birth: Date,
    ---
    password_hash:string,
    email:string,
    gender_type_id: number
    ---
    person_id: person.id
*/

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const createUser = async (data: ICreateUser): Promise<IUserDto> => {

    const NewPerson: ICreatePerson = {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
    };

    const person: clientType.persons = await PersonRepo.createPerson(NewPerson)

    if (!person) {
        throw new HttpError("Error In add person.", 400);
    }

    const hashedPassword = await UserHelper.hashPassword(data.password_hash);

    const user: UserWithPersonAndRoles | null = await authRepo.creatUser({
        email: data.email,
        password_hash: hashedPassword,
        person_id: person.id,
        gender_type_id: data.gender_type_id
    } as ICreateUser & { person_id: number })

    if (!user) {
        throw new HttpError("Error In add user.", 400);
    }
    const userDto: IUserDto = mapUserWithPersonAndRolesToDto(user)

    return userDto
}

export async function validateUserCredentials(email: string, password: string): Promise<IUserDto> {

    const user: UserWithPersonAndRoles | null = await authRepo.findUserByEmail(email);

    if (!user) {
        throw new HttpError("User not found.", 404);
    }

    const valid: boolean = await UserHelper.comparePassword(password, user.password_hash);

    if (!valid) {
        throw new HttpError("User or password Invalid.", 404);
    }

    const userDto: IUserDto = mapUserWithPersonAndRolesToDto(user)
    return userDto
}

export function generateAccessToken(user: IUserDto): string {
    return jwt.sign(
        { userId: user.id, roles: user.roles }, // 
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );
}

export function generateRefreshToken(user: IUserDto): string {
    return jwt.sign(
        { userId: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );
}

export async function storeRefresh(userId: number, token: string): Promise<clientType.refresh_tokens> {
    const expiry: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return await authRepo.saveRefreshToken(userId, token, expiry);
}

export async function verifyAndGetUserIdFromRefresh(token: string): Promise<number> {
    const stored: clientType.refresh_tokens | null = await authRepo.getRefreshToken(token);

    if (!stored) {
        throw new HttpError("Invalid refresh token.", 400);
    }

    if (new Date() > stored.expiry) {
        // ممكن تحذف التوكين قبل ما ترمي الايرور ك احترافيه
        throw new HttpError("Refresh token expired.", 400);
    }

    jwt.verify(token, REFRESH_SECRET);

    return stored.user_id;
}

export async function getUserById(userId: number): Promise<IUserDto> {
    const user: UserWithPersonAndRoles | null = await authRepo.findUserById(userId);

    if (!user) {
        throw new HttpError("User not found.", 404);
    }

    const userDto: IUserDto = mapUserWithPersonAndRolesToDto(user)
    return userDto
}

export async function removeRefreshToken(token: string): Promise<void> {
    await authRepo.deleteRefreshToken(token);
}