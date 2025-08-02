import { Router } from "express";
import * as ProfileController from "../../../2-Business/user/controller/profileController.js";
import { ValidationUpdateUser, validate } from "../middleware/userValidation.js";
import { memoryUpload } from "../../../shared/middleware/uploadMemory.js";
import { validateImage } from "../../../shared/middleware/validateImage.js";
const router: Router = Router();


router.get("/", ProfileController.getMyProfile); // Get a specific user by ID

router.put("/",
    memoryUpload.single("profile_picture"),
    ...validateImage("profile_picture", false),
    ValidationUpdateUser,
    validate,
    ProfileController.updateMyProfile
);// Update a user by ID

export default router;
