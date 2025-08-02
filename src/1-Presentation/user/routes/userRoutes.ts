import { Router } from "express";
import * as UserController from "../../../2-Business/user/controller/userController.js";
import {
    ValidationUpdateUser,
    validate
} from "../middleware/userValidation.js";
const router: Router = Router();

router.get("/", UserController.getAllUsers); // Get all users
router.get("/:id", UserController.getUserById); // Get a specific user by ID
router.put("/:id", ValidationUpdateUser,validate, UserController.updateUser); // Update a user by ID
router.delete("/:id", UserController.deleteUser);// Delete a user by ID

export default router;
