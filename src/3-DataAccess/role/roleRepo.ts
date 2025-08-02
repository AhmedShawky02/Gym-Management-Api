import prisma from "../../config/prismaClient.js";
import * as clientType from "@prisma/client";
import { RolesWithUserAndPerson } from "../../models/role/RolesWithUserAndPerson.js";
import { ICreateRole } from "../../models/role/ICreateRole.js";

export async function getAllRoles(): Promise<clientType.roles[]> {
    return await prisma.roles.findMany()
}

export async function getRoleWithUsersByRoleId(RoleId: number): Promise<RolesWithUserAndPerson[]> {
    return await prisma.user_roles.findMany({
        where: {
            role_id: RoleId,
        },
        include: {
            users: {
                select: {
                    id: true,
                    email: true,
                    gender_type_id: true,
                    persons: {
                        select: {
                            id: true,
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            date_of_birth: true,
                        }
                    }
                }
            },
            roles: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    })
}

export async function createRole(RoleName: string): Promise<ICreateRole> {
    return await prisma.roles.create({
        data: {
            name: RoleName
        },
        select: {
            id: true,
            name: true
        }
    })
}

export async function getRoleByRoleId(RoleId: number): Promise<ICreateRole | null> {
    return await prisma.roles.findUnique({
        where: {
            id: RoleId
        },
        select: {
            id: true,
            name: true,
        }
    })
}

export async function updateRole(RoleId: number, RoleName: string): Promise<ICreateRole> {
    return await prisma.roles.update({
        where: {
            id: RoleId
        },
        data: {
            name: RoleName
        },
        select: {
            id: true,
            name: true
        }
    })
}

export async function deleteRole(RoleId: number): Promise<void> {
    await prisma.roles.delete({
        where: {
            id: RoleId
        }
    })
}

export async function getRoleByName(roleName: string): Promise<ICreateRole | null> {
    return await prisma.roles.findFirst({
        where: {
            name: {
                equals: roleName,
                mode: "insensitive"
            }
        },
        select: {
            id: true,
            name: true
        }
    });
}