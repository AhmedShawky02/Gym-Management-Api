import { Router } from "express";
import * as SupplementController from "../../../2-Business/supplement/controller/supplementController.js";
import { validate } from "../middleware/supplementValidator.js";
import { ValidationCreateSupplement, ValidationUpdateSupplement } from "../middleware/supplementValidator.js";
import { validateImage } from "../../../shared/middleware/validateImage.js";
import { memoryUpload } from "../../../shared/middleware/uploadMemory.js";
const router = Router();

// Admin routes
router.post("/",
    memoryUpload.single("image_url"),
    ...validateImage("image_url", true),
    ValidationCreateSupplement,
    validate,
    SupplementController.addSupplement
);         // إضافة
router.put("/:id",
    memoryUpload.single("image_url"),
    ...validateImage("image_url", false),
    ValidationUpdateSupplement,
    validate,
    SupplementController.updateSupplement
);     // تعديل
router.get("/", SupplementController.getAllSupplements);                                        // كل المكملات
router.delete("/:id", SupplementController.deleteSupplement);                                        // حذف

export default router;
