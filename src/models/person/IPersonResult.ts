export interface IPersonResult {
    id: number,
    first_name: string,
    middle_name: string | null,
    last_name: string | null,
    date_of_birth: Date | null,
    created_at: Date | null
}