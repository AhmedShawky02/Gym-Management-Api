import * as clientType from "@prisma/client";

export type UserWithPersonAndRoles = clientType.users & {
    persons: clientType.persons;
    user_roles: (clientType.user_roles & {
        roles: clientType.roles | null
    })[];
};
