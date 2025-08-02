import * as UserRoleRepo from "../../../3-DataAccess/userRole/userRoleRepo.js"
import * as RoleRepo from "../../../3-DataAccess/role/roleRepo.js"
import * as UserRepo from "../../../3-DataAccess/user/userRepo.js"
import * as authRepo from "../../../3-DataAccess/user/authRepo.js"
import * as TrainerRepo from "../../../3-DataAccess/trainer/adminTrainerRepo.js"
import { HttpError } from '../../../utils/HttpError.js';
import { UserWithPersonAndRoles } from "../../../models/user/UserWithPersonAndRoles.js";
import { ICreateRole } from "../../../models/role/ICreateRole.js";
import { IAssignedUserRoleDto } from "../../../models/userRole/IAssignedUserRoleDto.js";
import { IAssignedUserRoleViewDto } from "../../../models/userRole/IAssignedUserRoleViewDto.js";
import { mapAllUserRolesToDto, mapUserRolesToDto, mapUserRoleToDto } from "../../../mapping/userRoleMapper.js";
import { IUserRoleDto } from "../../../models/userRole/IUserRoleDto.js";
import { IUserRoles } from "../../../models/user/IUserRoles.js"
import { IAllUserRolesView } from "../../../models/user/IAllUserRolesView.js"

export async function assignRoleToUser(user_id: number, role_id: number): Promise<IAssignedUserRoleViewDto> {

    const user: UserWithPersonAndRoles | null = await authRepo.findUserById(user_id);

    if (!user) {
        throw new HttpError("User not found.", 404);
    }

    const role: ICreateRole | null = await RoleRepo.getRoleByRoleId(role_id);

    if (!role) {
        throw new HttpError("Role not found.", 404);
    }

    if (role.name === "Trainer") {
        const trainer = await TrainerRepo.getTrainerByUserId(user_id);
        if (!trainer) {
            throw new HttpError("Cannot assign Trainer role to user without a trainer profile.", 400);
        }
    }

    const existingUserRole: IUserRoleDto | null = await UserRoleRepo.findUserRole(user_id, role_id);

    if (existingUserRole) {
        throw new HttpError("This user already has this role assigned.", 400);
    }

    const assignedUserRole: IAssignedUserRoleDto = await UserRoleRepo.assignRoleToUser(user_id, role_id);

    const assignedUserRoleView: IAssignedUserRoleViewDto = mapUserRoleToDto(assignedUserRole)

    return assignedUserRoleView;
}

export async function updateUserRole(user_role_id: number, role_id: number): Promise<IUserRoleDto> {
    const userRole: IUserRoleDto | null = await UserRoleRepo.getUserRoleById(user_role_id)

    if (!userRole) {
        throw new HttpError("UserRole not found.", 404)
    }

    const role = await RoleRepo.getRoleByRoleId(role_id);

    if (!role) {
        throw new HttpError("Role not found.", 404);
    }

    if (role.name === "Trainer") {
        const trainer = await TrainerRepo.getTrainerByUserId(userRole.user_id!);
        if (!trainer) {
            throw new HttpError("Cannot assign Trainer role to user without a trainer profile.", 400);
        }
    }

    const existingUserRole: IUserRoleDto | null = await UserRoleRepo.findUserRole(userRole.user_id!, role_id);

    if (existingUserRole) {
        throw new HttpError("This user already has this role assigned.", 400);
    }

    const userRoleUpdated: IUserRoleDto = await UserRoleRepo.updateUserRole(user_role_id, role_id)
    return userRoleUpdated
}

export async function deleteUserRole(user_role_id: number) {
    const userRole: IUserRoleDto | null = await UserRoleRepo.getUserRoleById(user_role_id)

    if (!userRole) {
        throw new HttpError("UserRole not found.", 404)
    }

    if (!userRole.role_id) {
        throw new HttpError("UserRole does not have a valid role ID.", 400);
    }

    const role = await RoleRepo.getRoleByRoleId(userRole.role_id);

    if (!role) {
        throw new HttpError("Role not found.", 404);
    }

    if (role.name.toLowerCase() === "user") {
        throw new HttpError("You cannot remove the 'User' role from any user.", 400);
    }

    if (!userRole.user_id) {
        throw new HttpError("UserRole does not have a valid user ID.", 400);
    }

    const isExists = await TrainerRepo.isTrainerExists(userRole.user_id)

    if (isExists) {
        throw new HttpError("Cannot remove 'Trainer' role while trainer profile exists.", 400);
    }

    await UserRoleRepo.deleteUserRole(user_role_id)
}

export async function getRolesForUser(userId: number): Promise<IAllUserRolesView[]> {
    const user: UserWithPersonAndRoles | null = await authRepo.findUserById(userId)

    if (!user) {
        throw new HttpError("User not found.", 404)
    }

    const userRoles: IUserRoles[] = await UserRepo.getAllRolesForUserByUserId(userId)

    const userRolesDto: IAllUserRolesView[] = mapAllUserRolesToDto(userRoles)

    return userRolesDto
}