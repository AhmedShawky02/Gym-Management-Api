import prisma from "../../config/prismaClient.js";
import { IAssignedUserRoleDto } from "../../models/userRole/IAssignedUserRoleDto.js";
import { IUserRoleDto } from "../../models/userRole/IUserRoleDto.js";

export async function assignRoleToUser(user_id: number, role_id: number): Promise<IAssignedUserRoleDto> {
    return await prisma.user_roles.create({
        data: {
            user_id,
            role_id
        },
        select: {
            user_role_id: true,
            users: {
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
            },
        }
    })
}

export async function getUserRoleById(UserRoleId: number): Promise<IUserRoleDto | null> {
    return await prisma.user_roles.findUnique({
        where: {
            user_role_id: UserRoleId
        },
        select: {
            user_role_id: true,
            role_id: true,
            user_id: true,
        }
    })
}

export async function updateUserRole(UserRoleId: number, RoleId: number): Promise<IUserRoleDto> {
    return await prisma.user_roles.update({
        where: {
            user_role_id: UserRoleId
        },
        data: {
            role_id: RoleId
        },
        select: {
            user_role_id: true,
            role_id: true,
            user_id: true,
        }
    })
}

export async function deleteUserRole(UserRoleId: number) {
    await prisma.user_roles.delete({
        where: {
            user_role_id: UserRoleId
        }
    })
}

export async function deleteUserRoleByUserAndRole(user_id: number, role_id: number): Promise<void> {
    await prisma.user_roles.deleteMany({
        where: {
            user_id,
            role_id
        }
    });
}

export async function findUserRole(user_id: number, role_id: number): Promise<IUserRoleDto | null> {
    return await prisma.user_roles.findFirst({
        where: {
            user_id,
            role_id
        },
        select: {
            user_role_id: true,
            role_id: true,
            user_id: true,
        }
    });
}