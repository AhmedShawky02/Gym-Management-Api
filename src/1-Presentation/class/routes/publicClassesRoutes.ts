import { Router } from "express";
import * as ClassController from "../../../2-Business/class/controller/classController.js";

const router: Router = Router();

// User route
router.get("/", ClassController.getAllClasses); // User view all Classes With Booking count 
router.get("/:id/stats", ClassController.getClassToUserById); // User view Class With Booking count 

export default router;