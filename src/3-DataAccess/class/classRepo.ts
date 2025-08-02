import prisma from "../../config/prismaClient.js";
import { ICreateClassRequest } from "../../models/class/ICreateClassRequest.js";
import { IUpdateClassRequest } from "../../models/class/IUpdateClassRequest.js";
import { IClassEntity } from "../../models/class/IClassEntity.js";
import { IClassCapacityAndBookingsCount } from "../../models/booking/IClassCapacityAndBookingsCount.js";

export async function createClass(classData: ICreateClassRequest, trainerId: number): Promise<IClassEntity> {
    return await prisma.classes.create({
        data: {
            ...classData,
            trainer_id: trainerId,
        },
        select: {
            id: true,
            title: true,
            trainers: {
                select: {
                    id: true,
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
            description: true,
            capacity: true,
            price: true,
            class_date: true,
            start_time: true,
            end_time: true,
            created_at: true
        }
    });
}

export async function getClassByIdAndTrainer(classId: number, trainerId: number): Promise<IClassEntity | null> {
    return await prisma.classes.findUnique({
        where: {
            id: classId,
            trainer_id: trainerId
        },
        select: {
            id: true,
            title: true,
            trainers: {
                select: {
                    id: true,
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
            description: true,
            capacity: true,
            price: true,
            class_date: true,
            start_time: true,
            end_time: true,
            created_at: true
        }
    });
}

export async function getClassesByTrainerId(trainerId: number): Promise<IClassEntity[]> {
    return await prisma.classes.findMany({
        where: {
            trainer_id: trainerId
        },
        select: {
            id: true,
            title: true,
            trainers: {
                select: {
                    id: true,
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
            description: true,
            capacity: true,
            price: true,
            class_date: true,
            start_time: true,
            end_time: true,
            created_at: true
        }
    });
}

export async function getAllClasses(): Promise<IClassEntity[]> {
    return await prisma.classes.findMany({
        select: {
            id: true,
            title: true,
            trainers: {
                select: {
                    id: true,
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
            description: true,
            capacity: true,
            price: true,
            class_date: true,
            start_time: true,
            end_time: true,
            created_at: true,
            _count: {
                select: {
                    bookings: true
                }
            }
        }
    })
}

export async function getClassById(classId: number): Promise<IClassEntity | null> {
    return await prisma.classes.findUnique({
        where: {
            id: classId
        },
        select: {
            id: true,
            title: true,
            trainers: {
                select: {
                    id: true,
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
            description: true,
            capacity: true,
            price: true,
            class_date: true,
            start_time: true,
            end_time: true,
            created_at: true,
            _count: {
                select: {
                    bookings: true
                }
            }
        }
    })
}

export async function getClassCapacityAndBookingsCount(classId: number): Promise<IClassCapacityAndBookingsCount | null> {
    return await prisma.classes.findUnique({
        where: { id: classId },
        select: {
            capacity: true,
            _count: {
                select: {
                    bookings: true
                }
            }
        }
    });
}

export async function updateClass(classData: IUpdateClassRequest, classId: number, trainerId: number): Promise<IClassEntity> {
    return await prisma.classes.update({
        where: { id: classId },
        data: {
            ...classData,
            trainer_id: trainerId,
        },
        select: {
            id: true,
            title: true,
            trainers: {
                select: {
                    id: true,
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
            description: true,
            capacity: true,
            price: true,
            class_date: true,
            start_time: true,
            end_time: true,
            created_at: true
        }
    });
}

export async function deleteClass(classId: number) {
    await prisma.classes.delete({
        where: { id: classId }
    });
}
