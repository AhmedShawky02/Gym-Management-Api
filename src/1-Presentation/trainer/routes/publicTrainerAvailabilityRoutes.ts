import { Router } from "express";
import * as TrainerAvailabilityController from "../../../2-Business/trainer/controller/TrainerAvailabilityController.js";

const router: Router = Router();

router.get("/:id/availability", TrainerAvailabilityController.getAvailabilityByTrainerId);

export default router;
