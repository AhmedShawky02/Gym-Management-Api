import { Router } from "express";
import { authenticateToken } from "../../user/middleware/authenticateToken.js";
import { authorizeRoles } from "../../user/middleware/authorizeRoles.js";
import { validate } from "../middleware/AdminTrainerValidation.js";
import { ValidationUpdateMyTrainerProfile } from "../middleware/TrainerProfileValidation.js";
import * as TrainerProfileController from "../../../2-Business/trainer/controller/TrainerProfileController.js";

const router: Router = Router();

router.put("/", authenticateToken, authorizeRoles(["Trainer"]), ValidationUpdateMyTrainerProfile, validate, TrainerProfileController.updateMyTrainerProfile);

export default router; 