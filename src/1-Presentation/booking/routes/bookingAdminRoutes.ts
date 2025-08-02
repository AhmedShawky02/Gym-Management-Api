import { Router } from "express";
import * as BookingController from "../../../2-Business/booking/controller/bookingController.js";
import { validate, ValidationChangeBookingStatus } from "../middleware/bookingValidation.js";

const router: Router = Router();

// Admin routes
router.get("/all", BookingController.getAllBookings); // Admin view all bookings
router.put("/:id/status", ValidationChangeBookingStatus, validate, BookingController.changeBookingStatus); // Admin change booking status

export default router;
