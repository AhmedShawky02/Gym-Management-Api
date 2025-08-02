import { Router } from "express";
import * as BookingController from "../../../2-Business/booking/controller/bookingController.js";
import { validate, ValidationChangeBookingStatus } from "../middleware/bookingValidation.js";

const router: Router = Router();

// Trainer route
router.get("/", BookingController.getTrainerBookings); // Trainer view bookings
router.put("/:id/status", ValidationChangeBookingStatus, validate, BookingController.changeTrainerBookingStatus); // Trainer change booking status

export default router;
