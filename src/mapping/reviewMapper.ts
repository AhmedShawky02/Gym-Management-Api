import { IReviewDto } from "../models/Review/IReviewDto.js";
import { IReviewModel } from "../models/Review/IReviewModel.js";

export function mapReviewToDto(review: IReviewModel): IReviewDto {
    const dto: any = {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at ?? null,
        user: {
            id: review.users.id,
            fullName: `${review.users.persons.first_name} ${review.users.persons.middle_name} ${review.users.persons.last_name}`,
            profilePicture: review.users.profile_picture ?? null,
        },
    };

    if (review.trainers?.id) {
        dto.trainer = {
            id: review.trainers.id,
            fullName: `${review.trainers.users.persons.first_name} ${review.trainers.users.persons.middle_name} ${review.trainers.users.persons.last_name}`,
        }
    }

    return dto
}

export function mapReviewsToDto(reviews: IReviewModel[]): IReviewDto[] {
    return reviews.map(mapReviewToDto)
}