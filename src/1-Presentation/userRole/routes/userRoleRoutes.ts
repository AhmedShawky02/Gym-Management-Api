import { Router } from "express";
import * as UserRoleController from "../../../2-Business/userRole/controller/userRoleController.js";
import { validate, ValidationAssignUserRole, ValidationUpdateUserRole } from "../middleware/userRoleValidation.js";

const router: Router = Router();

// إضافة صلاحية لمستخدم
// body: { userId, roleId }
router.post("/", ValidationAssignUserRole, validate, UserRoleController.assignRoleToUser);

// تعديل صلاحية مستخدم
//  params: id (user_role_id)
//  body: { roleId }
router.put("/:id", ValidationUpdateUserRole, validate, UserRoleController.updateUserRole);

// حذف صلاحية من مستخدم
// params: id (user_role_id)
router.delete("/:id", UserRoleController.deleteUserRole);


// جلب كل صلاحيات مستخدم
// params: userId
router.get("/user/:userId", UserRoleController.getRolesForUser);

export default router;
