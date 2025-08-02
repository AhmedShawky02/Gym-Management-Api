import * as clientType from "@prisma/client";
import { IRoleDto } from "../models/role/IRoleDto";
import { RolesWithUserAndPerson } from "../models/role/RolesWithUserAndPerson";
import { IRoleWithUsersDto } from "../models/role/IRoleWithUsersDto";

export const mapRolesToDto = (roles: clientType.roles[]): IRoleDto[] => {
    return roles.map(r => ({
        id: r.id,
        name: r.name
    }));
}

export const mapRolesWithUsersToDto = (roles: RolesWithUserAndPerson[]): IRoleWithUsersDto[] => {
    return roles.map(r => ({
        roleId: r.roles?.id ?? null, 
        roleName: r.roles?.name,
        users: r.users ? {
            id: r.users.id,
            fullName: r.users.persons.first_name + " " + r.users.persons.middle_name + " " + r.users.persons.last_name,
            email: r.users.email,
            gender: r.users.gender_type_id === 1 ? "male" : "female",
            dateOfBirth: r.users.persons.date_of_birth ? new Date(r.users.persons.date_of_birth).toLocaleDateString("en-GB") : null
        } : null
    }));
}

