export interface IReviewDto {
    id: number,
    rating: number,
    comment: string,
    createdAt: Date | null,
    user: {
        id: number,
        fullName: string,
        profilePicture: string
    },
    trainer?: {
        id: number,
        fullName: string,
    }

}