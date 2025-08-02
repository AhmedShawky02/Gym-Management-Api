export interface IUsersDto {
    id: number,
    email: string,
    person_id: number,
    gender_type_id: number | null,
    profile_picture: string | null,
    persons: {
        id: number,
        first_name: string,
        middle_name: string | null,
        last_name: string | null,
        created_at: Date | null

    }
}