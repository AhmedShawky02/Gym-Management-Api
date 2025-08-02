import { Router } from "express";
import * as SupplementController from "../../../2-Business/supplement/controller/supplementController.js";

const router = Router();

// User route
router.get("/", SupplementController.getAllSupplements);   // المكملات المتاحة للمستخدم
router.get("/:id", SupplementController.getSupplementsById);   // المكملات المتاحة للمستخدم

export default router;
