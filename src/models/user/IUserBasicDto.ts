export interface IUserBasicDto {
    id: number;
    fullName: string;
    email: string;
    createdDate: string | null;
    gender: string;
    date_of_birth: Date | null
    profile_picture?: string;
}
