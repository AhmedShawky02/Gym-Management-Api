import * as ReviewRepo from "../../../3-DataAccess/Review/reviewRepo.js";
import * as TrainerRepo from "../../../3-DataAccess/trainer/adminTrainerRepo.js"
import * as UserRepo from "../../../3-DataAccess/user/userRepo.js"
import { mapReviewsToDto, mapReviewToDto } from "../../../mapping/reviewMapper.js";
import { ICreateReviewRequest } from "../../../models/Review/ICreateReviewRequest.js";
import { IReviewDto } from "../../../models/Review/IReviewDto.js";
import { IReviewModel } from "../../../models/Review/IReviewModel.js";
import { IUpdateReviewRequest } from "../../../models/Review/IUpdateReviewRequest.js";
import { ITrainerDto } from "../../../models/trainer/ITrainerDto.js";
import { IUsersDto } from "../../../models/user/IUsersDto.js";
import { HttpError } from "../../../utils/HttpError.js";

//User

export async function addReview(reviewData: ICreateReviewRequest, userId: number): Promise<IReviewDto> {

    if (reviewData.trainer_id) {
        const trainer: any = await TrainerRepo.getTrainerById(reviewData.trainer_id)

        if (!trainer) {
            throw new HttpError("Trainer not Found.", 404)
        }

        const reviewExists = await ReviewRepo.checkIfReviewExists(
            userId,
            reviewData.trainer_id,
        );

        if (reviewExists) {
            throw new HttpError("You have already reviewed this trainer.", 400);
        }

    } else {
        const reviewExists = await ReviewRepo.checkIfReviewExists(userId);

        if (reviewExists) {
            throw new HttpError("You have already reviewed this Gym.", 400);
        }
    }


    if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new HttpError("Rating must be an integer between 1 and 5", 400)
    }


    const createdReview: IReviewModel = await ReviewRepo.createReview(reviewData, userId);

    const createdReviewDto: IReviewDto = mapReviewToDto(createdReview);
    return createdReviewDto

}

export async function updateReviewById(reviewId: number, reviewData: IUpdateReviewRequest, userId: number): Promise<IReviewModel> {
    const review: IReviewModel | null = await ReviewRepo.getReviewById(reviewId);

    if (!review) {
        throw new HttpError("Review not found.", 404)
    }

    if (review.users.id !== userId) {
        throw new HttpError("You do not have permission.", 403)
    }

    if (reviewData.trainer_id) {
        const trainer: any = await TrainerRepo.getTrainerById(reviewData.trainer_id)

        if (!trainer) {
            throw new HttpError("Trainer not found.", 404)
        }

        const reviewExists = await ReviewRepo.checkIfReviewExists(
            userId,
            reviewData.trainer_id,
            reviewId
        );

        if (reviewExists) {
            throw new HttpError("You have already reviewed this trainer.", 400);
        }
    } else {
        const reviewExists = await ReviewRepo.checkIfReviewExists(userId, reviewId);

        if (reviewExists) {
            throw new HttpError("You have already reviewed this Gym.", 400);
        }
    }

    if (reviewData.rating) {

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            throw new HttpError("Rating must be an integer between 1 and 5", 400)
        }
    }

    const comment: string = reviewData.comment ?? review.comment
    const rating: number = reviewData.rating ?? review.rating
    const trainerId: number = reviewData.trainer_id! ?? review.trainers?.id

    const updated: IReviewModel = await ReviewRepo.updateReviewById(trainerId, reviewId, comment, rating)
    const updatedDto: any = mapReviewToDto(updated)
    return updatedDto

}

export async function deleteReviewById(reviewId: number, userId: number) {
    const review: IReviewModel | null = await ReviewRepo.getReviewById(reviewId);

    if (!review) {
        throw new HttpError("Review not found.", 404)
    }

    if (review.users.id !== userId) {
        throw new HttpError("You do not have permission.", 403)
    }

    await ReviewRepo.deleteReviewById(reviewId)
}

export async function getAllUserReviews(userId: number): Promise<IReviewDto[]> {
    const user: IUsersDto | null = await UserRepo.getUserById(userId)

    if (!user) {
        throw new HttpError("Unauthorized.", 401)
    }

    const reviews: IReviewModel[] = await ReviewRepo.getAllReviewsByUserId(userId)

    if (!reviews || reviews.length === 0) {
        throw new HttpError("Reviews not found.", 404);
    }

    const reviewsDto: IReviewDto[] = mapReviewsToDto(reviews)
    return reviewsDto
}

export async function getTrainerReviews(trainerId: number): Promise<IReviewDto[]> {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerById(trainerId)

    if (!trainer) {
        throw new HttpError("Trainer not found.", 401)
    }

    const reviews: IReviewModel[] = await ReviewRepo.getAllReviewsByTrainerId(trainerId);

    if (!reviews || reviews.length === 0) {
        throw new HttpError("Reviews not found.", 404);
    }

    const reviewsDto: IReviewDto[] = mapReviewsToDto(reviews)
    return reviewsDto
}

//Trainer

export async function getMyReviews(userId: number): Promise<IReviewDto[]> {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Unauthorized.", 401)
    }

    const reviews: IReviewModel[] = await ReviewRepo.getAllReviewsByTrainerId(trainer.id)

    if (!reviews || reviews.length === 0) {
        throw new HttpError("Reviews not found.", 404);
    }

    const reviewsDto: IReviewDto[] = mapReviewsToDto(reviews)
    return reviewsDto
}

//Admin

export async function getAllReviews() {
    const reviews: IReviewModel[] = await ReviewRepo.getAllReviews()

    if (!reviews || reviews.length === 0) {
        throw new HttpError("Reviews not found.", 404);
    }

    const reviewsDto: IReviewDto[] = mapReviewsToDto(reviews)
    return reviewsDto
}

export async function deleteReviewByAdmin(reviewId: number) {
    const review: IReviewModel | null = await ReviewRepo.getReviewById(reviewId);

    if (!review) {
        throw new HttpError("Review not found.", 404)
    }

    await ReviewRepo.deleteReviewById(reviewId)
}
