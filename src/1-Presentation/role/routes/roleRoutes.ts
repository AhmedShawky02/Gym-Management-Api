import { Router } from "express";
import * as RoleController from "../../../2-Business/role/controller/roleController.js";
import { validate, ValidationCreateRole, ValidationUpdateRole } from "../middleware/roleValidation.js";

const router: Router = Router();

router.get("/", RoleController.getAllRoles); //without users
router.get("/:id", RoleController.getRoleWithUsersById); // with useres
router.post("/", ValidationCreateRole, validate, RoleController.createRole); // Create Role like "Manager" 
router.put("/:id", ValidationUpdateRole, validate, RoleController.updateRole); // Convert "Trainer" To "Coach"
router.delete("/:id", RoleController.deleteRole); // Delete Role Like "Manager"


export default router;
