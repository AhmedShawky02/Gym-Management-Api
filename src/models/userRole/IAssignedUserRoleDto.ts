export interface IAssignedUserRoleDto {
    user_role_id: number;
    users: {
        id: number;
        email: string;
        gender_type_id: number;
        persons: {
            first_name: string;
            last_name: string | null;
        };
        user_roles: {
            roles: {
                id: number;
                name: string;
            } | null;
        }[];
    } | null;
}
