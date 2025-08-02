import prisma from "../../config/prismaClient.js";
import { ICreateBookingRequest } from "../../models/booking/ICreateBookingRequest.js";
import { IBookingEntity } from "../../models/booking/IBookingEntity.js";
import { IBookingForTrainer } from "../../models/booking/IBookingForTrainer.js";
import { IBookingStatus } from "../../models/booking/IBookingStatus.js";

export async function createBooking(data: ICreateBookingRequest, userId: number): Promise<IBookingEntity> {
    return await prisma.bookings.create({
        data: {
            user_id: userId,
            trainer_id: data.trainer_id,
            class_id: data.class_id,
            status_id: 1, // default status
        },
        select: {
            id: true,
            user_id: true,
            trainers: {
                select: {
                    id: true,
                    private_monthly_price: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true
                                }
                            }
                        }
                    }
                }
            },
            classes: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true
                }
            },
            booking_date: true,
            status_id: true,
            booking_statuses: {
                select:
                {
                    id: true,
                    name: true
                }
            }

        }
    });
}

export async function getBookingsByUserId(userId: number): Promise<IBookingEntity[]> {
    return await prisma.bookings.findMany({
        where: { user_id: userId },
        select: {
            id: true,
            user_id: true,
            trainers: {
                select: {
                    id: true,
                    private_monthly_price: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true
                                }
                            }
                        }
                    }
                }
            },
            classes: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true
                }
            },
            booking_date: true,
            status_id: true,
            booking_statuses: {
                select:
                {
                    id: true,
                    name: true
                }
            }

        }
    });
}

export async function getBookingsByTrainerId(trainerId: number): Promise<IBookingForTrainer[]> {
    return await prisma.bookings.findMany({
        where: {
            trainer_id: trainerId
        },
        select: {
            id: true,
            booking_date: true,
            status_id: true,
            users: {
                select: {
                    id: true,
                    email: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true
                        }
                    }
                }
            },
            classes: {
                select: {
                    id: true,
                    title: true,
                    capacity: true,
                    created_at: true,
                    class_date: true,
                    start_time: true,
                    end_time: true
                }
            },
            booking_statuses: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export async function getAllBookings(): Promise<IBookingEntity[]> {
    return await prisma.bookings.findMany({
        select: {
            id: true,
            user_id: true,
            trainers: {
                select: {
                    id: true,
                    private_monthly_price: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true
                                }
                            }
                        }
                    }
                }
            },
            classes: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true
                }
            },
            booking_date: true,
            status_id: true,
            booking_statuses: {
                select:
                {
                    id: true,
                    name: true
                }
            }

        }
    });
}

export async function getBookingById(bookingId: number): Promise<IBookingEntity | null> {
    return await prisma.bookings.findUnique({
        where: { id: bookingId },
        select: {
            id: true,
            user_id: true,
            trainers: {
                select: {
                    id: true,
                    private_monthly_price: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true
                                }
                            }
                        }
                    }
                }
            },
            classes: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true
                }
            },
            booking_date: true,
            status_id: true,
            booking_statuses: {
                select:
                {
                    id: true,
                    name: true
                }
            }

        }
    });
}

export async function updateBookingStatus(bookingId: number, statusId: number): Promise<IBookingEntity> {
    return await prisma.bookings.update({
        where: { id: bookingId },
        data: { status_id: statusId },
        select: {
            id: true,
            user_id: true,
            trainers: {
                select: {
                    id: true,
                    private_monthly_price: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true
                                }
                            }
                        }
                    }
                }
            },
            classes: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true
                }
            },
            booking_date: true,
            status_id: true,
            booking_statuses: {
                select:
                {
                    id: true,
                    name: true
                }
            }

        }
    });
}

export async function getBookingStatusById(statusId: number): Promise<IBookingStatus | null> {
    return await prisma.booking_statuses.findUnique({
        where: {
            id: statusId
        },
        select: {
            id: true,
            name: true
        }
    })
}

export async function deleteBookingById(bookingId: number) {
    await prisma.bookings.delete({
        where: {
            id: bookingId,
        }
    })
}

export async function deleteBookingsByUserId(userId: number) {
    await prisma.bookings.deleteMany({
        where: {
            user_id: userId,
        }
    })
}