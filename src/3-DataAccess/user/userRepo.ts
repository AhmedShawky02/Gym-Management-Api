import prisma from "../../config/prismaClient.js";
import { IUsersDto } from "../../models/user/IUsersDto.js";
import { IUpdateUserRequest } from "../../models/user/IUpdateUserRequest.js";
import { IUserRoles } from "../../models/user/IUserRoles.js";

export async function getAllUsers(): Promise<IUsersDto[]> {
    return await prisma.users.findMany({
        select: {
            id: true,
            email: true,
            person_id: true,
            gender_type_id: true,
            profile_picture: true,
            persons: {
                select: {
                    id: true,
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                    created_at: true,
                    date_of_birth: true

                }
            }
        }
    })
}

export async function getAllRolesForUserByUserId(userId: number): Promise<IUserRoles[]> {
    return await prisma.users.findMany({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            gender_type_id: true,
            persons: {
                select: {
                    first_name: true,
                    last_name: true
                }
            },
            user_roles: {
                select: {
                    roles: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                }
            }
        }
    })
}

export async function getUserById(userId: number): Promise<IUsersDto | null> {
    return await prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            person_id: true,
            gender_type_id: true,
            profile_picture: true,
            persons: {
                select: {
                    id: true,
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                    created_at: true,
                    date_of_birth: true
                }
            }
        }
    })
}

export async function updateUser(UserData: IUpdateUserRequest, userId: number): Promise<IUsersDto> {
    return await prisma.users.update({
        where: {
            id: userId
        },
        data: {
            ...UserData
        },
        select: {
            id: true,
            email: true,
            person_id: true,
            gender_type_id: true,
            profile_picture: true,
            persons: {
                select: {
                    id: true,
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                    created_at: true,
                    date_of_birth: true
                }
            }
        }
    })
}

export async function deleteUser(userId: number) {
    await prisma.users.delete({
        where: {
            id: userId
        }
    })
}

export async function deleteAllTokensByUser(userId: number) {
    await prisma.refresh_tokens.deleteMany({
        where: {
            user_id: userId
        }
    });
}

export async function isUserExists(userId: number): Promise<boolean> {
    const user = await prisma.users.findFirst({
        where: {
            id: userId
        }
    });

    return !!user;
}