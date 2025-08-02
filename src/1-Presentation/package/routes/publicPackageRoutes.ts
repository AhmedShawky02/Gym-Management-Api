import { Router } from "express";
import * as PackageController from "../../../2-Business/package/controller/packageController.js";

const router: Router = Router();

// User route
router.get("/", PackageController.getAllPackages); // User view all packages

export default router;
