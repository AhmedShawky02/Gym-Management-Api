import * as BookingRepo from "../../../3-DataAccess/booking/bookingRepo.js";
import * as TrainerRepo from "../../../3-DataAccess/trainer/adminTrainerRepo.js"
import * as ClassRepo from "../../../3-DataAccess/class/classRepo.js"
import * as UserRepo from "../../../3-DataAccess/user/userRepo.js"
import { HttpError } from "../../../utils/HttpError.js";
import { IBookingBasicDto } from "../../../models/booking/IBookingBasicDto.js";
import { ICreateBookingRequest } from "../../../models/booking/ICreateBookingRequest.js";
import { IBookingEntity } from "../../../models/booking/IBookingEntity.js";
import { mapBookingEntityToDto } from "../../../mapping/bookingMapper.js";
import { IUsersDto } from "../../../models/user/IUsersDto.js";
import { IBookingForTrainer } from "../../../models/booking/IBookingForTrainer.js";
import { mapManyBookingsForTrainer } from "../../../mapping/bookingMapper.js";
import { IBookingTrainerDto } from "../../../models/booking/IBookingTrainerDto.js";
import { ITrainerDto } from "../../../models/trainer/ITrainerDto.js";
import { IBookingStatus } from "../../../models/booking/IBookingStatus.js";
import { IClassCapacityAndBookingsCount } from "../../../models/booking/IClassCapacityAndBookingsCount.js";

export async function createBooking(data: ICreateBookingRequest, userId: number): Promise<IBookingBasicDto> {
    if (!data.trainer_id && !data.class_id) {
        throw new HttpError("You must select at least a trainer or a class to book.", 400);
    }

    if (data.trainer_id && data.class_id) {
        throw new HttpError("Cannot book with both trainer and class at the same time", 400);
    }

    if (data.trainer_id) {
        const trainer: ITrainerDto | null = await TrainerRepo.getTrainerById(data.trainer_id)

        if (!trainer) {
            throw new HttpError("Trainer not Found.", 404);
        }

        if (userId === trainer?.user_id) {
            throw new HttpError("You cannot book a session with yourself.", 400);
        }

    }

    if (data.class_id) {
        const fitnessClass: IClassCapacityAndBookingsCount | null = await ClassRepo.getClassCapacityAndBookingsCount(data.class_id)

        if (!fitnessClass) {
            throw new HttpError("Class not found", 404);
        }

        const currentBookingsCount = fitnessClass._count.bookings;

        if (currentBookingsCount >= fitnessClass.capacity) {
            throw new HttpError("This class is fully booked.", 400);
        }
    }

    const bookings: IBookingEntity[] = await BookingRepo.getBookingsByUserId(userId)

    const isDuplicate = bookings.some(booking =>
        booking.status_id === 1 &&
        (
            (data.class_id && booking.classes?.id === data.class_id) ||
            (data.trainer_id && booking.trainers?.id === data.trainer_id)
        )
    );

    if (isDuplicate) {
        throw new HttpError(`You already have a pending booking with the same ${data.class_id ? "class" : "trainer"}.`, 400);
    }

    const newBooking: IBookingEntity = await BookingRepo.createBooking(data, userId);

    const newBookingDto: IBookingBasicDto = mapBookingEntityToDto(newBooking);

    return newBookingDto
}

export async function getMyBookings(userId: number): Promise<IBookingBasicDto[]> {

    const user: IUsersDto | null = await UserRepo.getUserById(userId)

    if (!user) {
        throw new HttpError("Unauthorized.", 404);
    }

    const bookings: IBookingEntity[] = await BookingRepo.getBookingsByUserId(userId);

    if (!bookings || bookings.length === 0) {
        throw new HttpError("Bookings not found.", 404);
    }

    return bookings.map(mapBookingEntityToDto);
}

export async function deleteMyBooking(userId: number, bookingId: number) {
    const booking: IBookingEntity | null = await BookingRepo.getBookingById(bookingId);

    if (!booking) {
        throw new HttpError("Booking not found.", 404);
    }

    if (booking.user_id !== userId) {
        throw new HttpError("You are not authorized to update this booking.", 403);
    }

    await BookingRepo.deleteBookingById(bookingId)
}

//------------------------------------------------------------------------

export async function getAllBookings(): Promise<IBookingBasicDto[]> {
    const bookings: IBookingEntity[] = await BookingRepo.getAllBookings();

    if (!bookings || bookings.length === 0) {
        throw new HttpError("Bookings not found.", 404);
    }

    return bookings.map(mapBookingEntityToDto);
}

export async function changeBookingStatus(bookingId: number, statusId: number): Promise<IBookingBasicDto> {
    const booking: IBookingEntity | null = await BookingRepo.getBookingById(bookingId);

    if (!booking) {
        throw new HttpError("Booking not found.", 404);
    }

    const statuse: IBookingStatus | null = await BookingRepo.getBookingStatusById(statusId)

    if (!statuse) {
        throw new HttpError("Statuse not found.", 404);
    }

    if (booking.status_id === statusId) {
        throw new HttpError("You already updated it to this status.", 400);
    }

    const updatedBooking: IBookingEntity = await BookingRepo.updateBookingStatus(bookingId, statusId);
    return mapBookingEntityToDto(updatedBooking);
}

//------------------------------------------------------------------------

export async function getBookingsByTrainerId(userId: number): Promise<IBookingTrainerDto[]> {
    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (!trainer) {
        throw new HttpError("Unauthorized.", 404);
    }

    const bookings: IBookingForTrainer[] = await BookingRepo.getBookingsByTrainerId(trainer.id);

    if (!bookings || bookings.length === 0) {
        throw new HttpError("Bookings not found.", 404);
    }

    const bookingsDto: IBookingTrainerDto[] = mapManyBookingsForTrainer(bookings)
    return bookingsDto
}

export async function changeMyBookingStatus(userId: number, bookingId: number, statusId: number) {
    const booking: IBookingEntity | null = await BookingRepo.getBookingById(bookingId);

    if (!booking) {
        throw new HttpError("Booking not found.", 404);
    }

    const trainer: ITrainerDto | null = await TrainerRepo.getTrainerByUserId(userId)

    if (booking.trainers?.id !== trainer?.id) {
        throw new HttpError("You are not authorized to update this booking.", 403);
    }

    const statuse: IBookingStatus | null = await BookingRepo.getBookingStatusById(statusId)

    if (!statuse) {
        throw new HttpError("Statuse not found.", 404);
    }

    if (booking.status_id === statusId) {
        throw new HttpError("You already updated it to this status.", 400);
    }

    const updatedBooking: IBookingEntity = await BookingRepo.updateBookingStatus(bookingId, statusId);
    return mapBookingEntityToDto(updatedBooking);
}