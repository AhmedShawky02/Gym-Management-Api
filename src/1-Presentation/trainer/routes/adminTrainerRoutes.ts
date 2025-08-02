import { Router } from "express";
import * as AdminTrainerController from "../../../2-Business/trainer/controller/adminTrainerController.js";
import {
    ValidationAddTrainer,
    ValidationUpdateTrainer,
    validate
} from "../middleware/AdminTrainerValidation.js";

const router: Router = Router();
router.post("/", ValidationAddTrainer, validate, AdminTrainerController.addTrainer); // Add trainer
router.put("/:id", ValidationUpdateTrainer, validate, AdminTrainerController.updateTrainer); // Update trainer by ID
router.get("/", AdminTrainerController.getAllTrainers); // Get all trainers
router.get("/:id", AdminTrainerController.getTrainerByUserId); // Get trainer by User ID
router.delete("/:id", AdminTrainerController.deleteTrainer); // Delete trainer by ID

export default router;
