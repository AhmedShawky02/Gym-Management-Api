import * as RoleRepo from "../../../3-DataAccess/role/roleRepo.js"
import * as clientType from "@prisma/client";
import { mapRolesToDto, mapRolesWithUsersToDto } from "../../../mapping/roleMapper.js"
import { IRoleDto } from "../../../models/role/IRoleDto.js";
import { HttpError } from '../../../utils/HttpError.js';
import { RolesWithUserAndPerson } from "../../../models/role/RolesWithUserAndPerson.js";
import { IRoleWithUsersDto } from "../../../models/role/IRoleWithUsersDto.js";
import { ICreateRole } from "../../../models/role/ICreateRole.js";

export async function getAllRoles(): Promise<IRoleDto[]> {
    const roles: clientType.roles[] = await RoleRepo.getAllRoles();

    if (!roles || roles.length === 0) {
        throw new HttpError("Role not found.", 404);
    }

    const rolesDto: IRoleDto[] = mapRolesToDto(roles)
    return rolesDto
}

export async function getRoleWithUsersByRoleId(RoleId: number): Promise<IRoleWithUsersDto[]> {
    const roelsWithUser: RolesWithUserAndPerson[] = await RoleRepo.getRoleWithUsersByRoleId(RoleId);

    if (!roelsWithUser || roelsWithUser.length === 0) {
        throw new HttpError("Role not found.", 404);
    }

    const rolesDto: IRoleWithUsersDto[] = mapRolesWithUsersToDto(roelsWithUser)
    return rolesDto
}

export async function createRole(RoleName: string): Promise<ICreateRole> {
    const newRole: ICreateRole = await RoleRepo.createRole(RoleName);

    if (!newRole) {
        throw new HttpError("Error in creating role.", 400);
    }

    return newRole;
}

export async function updateRole(id: number, name: string): Promise<ICreateRole> {
    const role: ICreateRole | null = await RoleRepo.getRoleByRoleId(id)

    if (!role) {
        throw new HttpError("Role not found.", 404);
    }

    const updatedRole: ICreateRole = await RoleRepo.updateRole(id, name)
    return updatedRole
}

export async function deleteRole(RoleId: number): Promise<void> {
    const role: ICreateRole | null = await RoleRepo.getRoleByRoleId(RoleId)

    if (!role) {
        throw new HttpError("Role not found.", 404);
    }

    return await RoleRepo.deleteRole(RoleId)
}