import { Router } from "express";
import * as PaymentController from "../../../2-Business/payment/controller/paymentController.js";
import { ValidationCreatePayment, validate } from "../middleware/paymentValidation.js";

const router: Router = Router();

// User: make payment (with Stripe integration)
router.post("/", ValidationCreatePayment, validate, PaymentController.createPayment);

// User: view my payments
router.get("/", PaymentController.getMyPayments);

export default router;
