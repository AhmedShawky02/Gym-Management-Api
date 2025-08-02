import { Router } from "express";
import * as PaymentController from "../../../2-Business/payment/controller/paymentController.js";

const router = Router();

router.post("/webhook", PaymentController.handlePaymobWebhook);

export default router;