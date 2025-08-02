import { Router } from "express";
import * as ReviewController from "../../../2-Business/Review/controller/reviewController.js";

const router = Router();

//Trainer
router.get("/my", ReviewController.getMyReviews);

export default router;
