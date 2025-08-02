export interface IReviewModel {
    id: number,
    users: {
        id: number,
        profile_picture: string | null,
        persons: {
            first_name: string,
            middle_name: string | null,
            last_name: string | null,
        }
    },
    rating: number,
    comment: string,
    created_at: Date | null,
    trainers: {
        id: number | null,
        users: {
            persons: {
                first_name: string,
                middle_name: string | null,
                last_name: string | null,

            }
        }
    } | null

}