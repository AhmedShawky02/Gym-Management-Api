import { Router } from "express";
import * as ReviewController from "../../../2-Business/Review/controller/reviewController.js";
import { ValidationCreateReview, ValidationUpdateReview, validate } from "../middleware/reviewValidator.js";

const router = Router();

//User
router.post("/", ValidationCreateReview, validate, ReviewController.addReview); // Add Review To ( Trainer OR GYM )
router.put("/:id", ValidationUpdateReview, validate, ReviewController.updateReviewById); // Update Review To ( Trainer OR GYM )
router.delete("/:id", ReviewController.deleteReviewById); // Delete My Review
router.get("/", ReviewController.getAllUserReviews) // Get All My Reviews
router.get("/:trainerId", ReviewController.getTrainerReviews); // Get Trainer Reviews By Trainer Id

export default router;