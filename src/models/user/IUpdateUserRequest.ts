export interface IUpdateUserRequest {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: Date | string;
    gender_type_id?: number;
}
