import { Router } from "express";
import * as PackageController from "../../../2-Business/package/controller/packageController.js";
import { validate, ValidationCreatePackage, ValidationUpdatePackage } from "../middleware/packageValidation.js";

const router: Router = Router();

// Admin routes
router.post("/", ValidationCreatePackage, validate, PackageController.createPackage); // Create package
router.get("/", PackageController.getAllPackages); // Get all packages
router.put("/:id", ValidationUpdatePackage, validate, PackageController.updatePackage); // Update package
router.delete("/:id", PackageController.deletePackage); // Delete package

export default router;
