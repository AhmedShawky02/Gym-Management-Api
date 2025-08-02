import { Router } from "express";
import * as ReviewController from "../../../2-Business/Review/controller/reviewController.js";

const router = Router();

//Admin
router.get("/", ReviewController.getAllReviews) // Get All Reviews
router.delete("/:id", ReviewController.deleteReviewByAdmin); // Delete Review By Review Id

export default router;