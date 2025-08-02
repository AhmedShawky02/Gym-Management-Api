import { IAllUserRolesView } from "../models/user/IAllUserRolesView";
import { IUserRoles } from "../models/user/IUserRoles";
import { IAssignedUserRoleDto } from "../models/userRole/IAssignedUserRoleDto";
import { IAssignedUserRoleViewDto } from "../models/userRole/IAssignedUserRoleViewDto";

export const mapUserRoleToDto = (userRole: IAssignedUserRoleDto): IAssignedUserRoleViewDto => {
    return {
        user_role_id: userRole.user_role_id,
        user: {
            user_id: userRole.users?.id!,
            fullName: `${userRole.users?.persons.first_name} ${userRole.users?.persons.last_name}`,
            gender: userRole.users?.gender_type_id === 1 ? "male" : "female",
            email: userRole.users?.email!,
            roles: userRole.users?.user_roles?.map(r => ({
                role_Id: r.roles?.id!,
                role_Name: r.roles?.name!
            })) || []
        },
    };
};

export const mapUserRolesToDto = (userRoles: IAssignedUserRoleDto[]): IAssignedUserRoleViewDto[] => {
    return userRoles.map(mapUserRoleToDto);
};

export const mapAllUserRolesToDto = (userRoles: IUserRoles[]): IAllUserRolesView[] => {
    return userRoles.map(user => ({
        user_id: user.id!,
        fullName: `${user.persons.first_name} ${user.persons.last_name}`,
        gender: user.gender_type_id === 1 ? "male" : "female",
        email: user.email!,
        roles: user.user_roles?.map(r => ({
            role_Id: r.roles?.id!,
            role_Name: r.roles?.name!
        })) || []
    }));
};