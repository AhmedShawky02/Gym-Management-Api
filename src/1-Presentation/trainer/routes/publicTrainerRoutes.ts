import { Router } from "express";

import * as TrainerController from "../../../2-Business/trainer/controller/TrainerController.js";

const router = Router();

router.get("/", TrainerController.getAllTrainers);

export default router;
