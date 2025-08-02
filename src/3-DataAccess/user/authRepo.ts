import prisma from "../../config/prismaClient.js";
import { ICreateUser } from "../../models/user/ICreateUser.js";
import { UserWithPersonAndRoles } from "../../models/user/UserWithPersonAndRoles.js";
import * as clientType from "@prisma/client";


export async function creatUser(dataPerson: ICreateUser & { person_id: number }): Promise<UserWithPersonAndRoles | null> {
    return await prisma.users.create({
        data: {
            ...dataPerson,
            user_roles: {
                create: [
                    { role_id: 2 }
                ]
            }
        },
        include: {
            persons: true,
            user_roles: {
                include: {
                    roles: true
                }
            }
        }
    })
}

export async function findUserByEmail(email: string): Promise<UserWithPersonAndRoles | null> {
    return await prisma.users.findUnique({
        where: {
            email
        },
        include: {
            persons: true,
            user_roles: {
                include: {
                    roles: true
                }
            }
        }
    })
}

export async function saveRefreshToken(userId: number, token: string, expiry: Date): Promise<clientType.refresh_tokens> {
    return await prisma.refresh_tokens.create({
        data: {
            user_id: userId,
            token,
            expiry
        }
    });
}

export async function getRefreshToken(token: string): Promise<clientType.refresh_tokens | null> {
    return await prisma.refresh_tokens.findUnique({
        where: { token }
    });
}

export async function findUserById(id: number): Promise<UserWithPersonAndRoles | null> {
    return await prisma.users.findUnique({
        where: {
            id
        },
        include: {
            persons: true,
            user_roles: {
                include: {
                    roles: true
                }
            }
        }
    })
}

export async function deleteRefreshToken(token: string): Promise<{ count: number }> {
    return prisma.refresh_tokens.deleteMany({
        where: { token }
    });
}
