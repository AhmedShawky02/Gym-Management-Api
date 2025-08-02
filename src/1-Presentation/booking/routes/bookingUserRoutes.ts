import { Router } from "express";
import * as BookingController from "../../../2-Business/booking/controller/bookingController.js";
import { validate, ValidationCreateBooking } from "../middleware/bookingValidation.js";

const router: Router = Router();

// User routes
router.post("/", ValidationCreateBooking, validate, BookingController.createBooking); // User create booking
router.get("/", BookingController.getMyBookings); // User view my bookings
router.delete("/:id",BookingController.deleteMyBookingById)


export default router;
