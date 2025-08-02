import { Request, Response } from "express";
import * as BookingService from "../../../2-Business/booking/service/bookingService.js";
import { HttpError } from "../../../utils/HttpError.js";
import { IBookingBasicDto } from "../../../models/booking/IBookingBasicDto.js";
import { IChangeBookingStatusRequest } from "../../../models/booking/IChangeBookingStatusRequest.js";
import { ICreateBookingRequest } from "../../../models/booking/ICreateBookingRequest.js";
import { IBookingTrainerDto } from "../../../models/booking/IBookingTrainerDto.js";

export async function createBooking(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const bookingData: ICreateBookingRequest = req.body;

        const bookingDto: IBookingBasicDto = await BookingService.createBooking(bookingData, userId);
        res.status(201).json(bookingDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyBookings(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const bookingsDto: IBookingBasicDto[] = await BookingService.getMyBookings(userId);
        res.status(200).json(bookingsDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteMyBookingById(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const idParam = req.params.id;
        if (!idParam) {
            res.status(400).json({ message: "Booking ID is required." });
            return;
        }
        const bookingId = Number(idParam);
        if (isNaN(bookingId)) {
            res.status(400).json({ message: "Booking ID must be a number." });
            return;
        }

        await BookingService.deleteMyBooking(userId, bookingId);
        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}
//------------------------------------------------------------------------

export async function getAllBookings(req: Request, res: Response) {
    try {
        const bookingsDto: IBookingBasicDto[] = await BookingService.getAllBookings();
        res.status(200).json(bookingsDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function changeBookingStatus(req: Request, res: Response) {
    try {
        const idParam = req.params.id;
        if (!idParam) {
            res.status(400).json({ message: "Booking ID is required." });
            return;
        }
        const bookingId = Number(idParam);
        if (isNaN(bookingId)) {
            res.status(400).json({ message: "Booking ID must be a number." });
            return;
        }

        const data: IChangeBookingStatusRequest = req.body;
        const bookingDto: IBookingBasicDto = await BookingService.changeBookingStatus(bookingId, data.status_id);
        res.status(200).json(bookingDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//------------------------------------------------------------------------

export async function getTrainerBookings(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const bookingsDto: IBookingTrainerDto[] = await BookingService.getBookingsByTrainerId(userId);
        res.status(200).json(bookingsDto);

    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function changeTrainerBookingStatus(req: Request, res: Response) {
    try {

        const idParam = req.params.id;
        if (!idParam) {
            res.status(400).json({ message: "Booking ID is required." });
            return;
        }
        const bookingId = Number(idParam);
        if (isNaN(bookingId)) {
            res.status(400).json({ message: "Booking ID must be a number." });
            return;
        }

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { status_id }: { status_id: number } = req.body

        const bookingsDto: IBookingBasicDto = await BookingService.changeMyBookingStatus(userId, bookingId, status_id);
        res.status(200).json(bookingsDto);

    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}