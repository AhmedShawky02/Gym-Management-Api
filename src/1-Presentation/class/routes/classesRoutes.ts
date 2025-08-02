import { Router } from "express";
import * as ClassController from "../../../2-Business/class/controller/classController.js";
import { validate, ValidationCreateClass, ValidationUpdateClass } from "../middleware/classValidation.js";

const router: Router = Router();

router.post("/", ValidationCreateClass, validate, ClassController.createMyClass); // Add class
router.get("/", ClassController.getMyClasses); // Get all my classes
router.get("/:id", ClassController.getMyClassById); // Get my class by ID
router.put("/:id", ValidationUpdateClass, validate, ClassController.updateClass); // Update my class by ID
router.delete("/:id", ClassController.deleteMyClass); // Delete my class by ID


export default router;
