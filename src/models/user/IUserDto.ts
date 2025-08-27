export interface IUserDto {
        id: number,
        fullName: string,
        email: string,
        createdDate: string | null,
        gender: string,
        profile_picture: string,
        date_of_birth: Date | null
        roles?: string[]
}