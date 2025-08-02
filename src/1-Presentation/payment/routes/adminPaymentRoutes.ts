import { Router } from "express";
import * as PaymentController from "../../../2-Business/payment/controller/paymentController.js";
import { ValidationUpdatePaymentStatus, validate } from "../middleware/paymentValidation.js";

const router: Router = Router();

// Admin: view all payments
router.get("/", PaymentController.getAllPayments);

// Admin: update payment status
router.put("/:id/status", ValidationUpdatePaymentStatus, validate, PaymentController.updatePaymentStatusById);

export default router;
