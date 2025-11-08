import { Router } from "express";
import * as PaymentController from "../../../2-Business/payment/controller/paymentController.js";
import { ValidationCreatePayment, validate } from "../middleware/paymentValidation.js";

const router: Router = Router();

// User: make payment (with Stripe integration)
router.post("/booking_Package", ValidationCreatePayment, validate, PaymentController.createPaymentLinkToBookingOrPackage);
router.post("/cart", ValidationCreatePayment, validate, PaymentController.createPaymentLinkToCart);

// User: view my payments
router.get("/", PaymentController.getMyPayments);

export default router;
