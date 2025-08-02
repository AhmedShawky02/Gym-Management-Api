import { Request, Response } from "express";
import * as ReviewService from "../../../2-Business/Review/service/reviewService.js";
import { HttpError } from "../../../utils/HttpError.js";
import { ICreateReviewRequest } from "../../../models/Review/ICreateReviewRequest.js";
import { IReviewDto } from "../../../models/Review/IReviewDto.js";
import { IUpdateReviewRequest } from "../../../models/Review/IUpdateReviewRequest.js";
import { IReviewModel } from "../../../models/Review/IReviewModel.js";

//User

export async function addReview(req: Request, res: Response) {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized. User ID is missing." });
            return;
        }

        const reviewData: ICreateReviewRequest = req.body;

        const reviewDto: IReviewDto = await ReviewService.addReview(reviewData, userId);
        res.status(201).json(reviewDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateReviewById(req: Request, res: Response) {
    try {
        const IdParam = req.params.id;

        if (!IdParam) {
            res.status(400).json({ message: "Review ID is required." });
            return;
        }

        const reviewId = Number(IdParam);
        if (isNaN(reviewId)) {
            res.status(400).json({ message: "Review ID must be a number." });
            return;
        }

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized. User ID is missing." });
            return;
        }


        const reviewData: IUpdateReviewRequest = req.body;

        const updatedDto: IReviewModel = await ReviewService.updateReviewById(reviewId, reviewData, userId)
        res.status(200).json(updatedDto)
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteReviewById(req: Request, res: Response) {
    try {
        const IdParam = req.params.id;

        if (!IdParam) {
            res.status(400).json({ message: "Review ID is required." });
            return;
        }

        const reviewId = Number(IdParam);
        if (isNaN(reviewId)) {
            res.status(400).json({ message: "Review ID must be a number." });
            return;
        }

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized. User ID is missing." });
            return;
        }

        await ReviewService.deleteReviewById(reviewId, userId)
        res.status(200).json({ message: "Review deleted successfully." });

    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllUserReviews(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized. User ID is missing." });
            return;
        }

        const reviews: IReviewDto[] = await ReviewService.getAllUserReviews(userId)
        res.status(200).json(reviews)
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getTrainerReviews(req: Request, res: Response) {
    try {
        const trainerIdParam = req.params.trainerId;

        if (!trainerIdParam) {
            res.status(400).json({ message: "Trainer ID is required." });
            return;
        }

        const trainerId = Number(trainerIdParam);
        if (isNaN(trainerId)) {
            res.status(400).json({ message: "Trainer ID must be a number." });
            return;
        }

        const reviewsDto: IReviewDto[] = await ReviewService.getTrainerReviews(trainerId);
        res.status(200).json(reviewsDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Trainer

export async function getMyReviews(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized. User ID is missing." });
            return;
        }

        const reviewsDto: IReviewDto[] = await ReviewService.getMyReviews(userId);
        res.status(200).json(reviewsDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Admin

export async function getAllReviews(req: Request, res: Response) {
    try {
        const reviews: IReviewDto[] = await ReviewService.getAllReviews()
        res.status(200).json(reviews)
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteReviewByAdmin(req: Request, res: Response) {
    try {
        const IdParam = req.params.id;

        if (!IdParam) {
            res.status(400).json({ message: "Review ID is required." });
            return;
        }

        const reviewId = Number(IdParam);
        if (isNaN(reviewId)) {
            res.status(400).json({ message: "Review ID must be a number." });
            return;
        }


        await ReviewService.deleteReviewByAdmin(reviewId)
        res.status(200).json({ message: "Review deleted successfully." });

    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}