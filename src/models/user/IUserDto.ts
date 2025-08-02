export interface IUserDto {
        id: number,
        fullName: string,
        email: string,
        createdDate: string | null,
        gender: string,
        profile_picture: string,
        roles?: string[]
}