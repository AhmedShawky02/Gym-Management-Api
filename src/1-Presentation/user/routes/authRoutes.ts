import { Router } from "express";
import * as AuthController from "../../../2-Business/user/controller/authController.js";
import {
    ValidationRegister,
    ValidationLogin,
    validate
} from "../middleware/userValidation.js";
const router: Router = Router();

router.post("/register", ValidationRegister, validate, AuthController.register)
router.post("/login", ValidationLogin, validate, AuthController.login)
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);


export default router;
