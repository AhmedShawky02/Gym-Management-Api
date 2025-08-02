import { Router } from "express";
import { validate } from "../middleware/AdminTrainerValidation.js";
import {
  ValidationAddAvailability,
  ValidationUpdateAvailability
} from "../middleware/TrainerAvailabilityValidation.js";
import * as TrainerAvailabilityController from "../../../2-Business/trainer/controller/TrainerAvailabilityController.js";

const router: Router = Router();

router.post("/", ValidationAddAvailability, validate, TrainerAvailabilityController.addAvailability); // Add availability
router.get("/", TrainerAvailabilityController.getMyAvailability); // Get my availability
router.put("/:id", ValidationUpdateAvailability, validate, TrainerAvailabilityController.updateAvailability); // Update availability by ID
router.delete("/:id", TrainerAvailabilityController.deleteAvailability); // Delete availability by ID


export default router; 