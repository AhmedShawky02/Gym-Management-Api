export interface ICreateUser {
    first_name: string,
    middle_name: string,
    last_name: string,
    date_of_birth: Date,
    password_hash: string,
    email: string,
    gender_type_id: number
}