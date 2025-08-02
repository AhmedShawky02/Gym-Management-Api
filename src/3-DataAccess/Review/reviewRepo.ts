import prisma from "../../config/prismaClient.js";
import { ICreateReviewRequest } from "../../models/Review/ICreateReviewRequest.js";
import { IReviewModel } from "../../models/Review/IReviewModel.js";

export async function createReview(reviewData: ICreateReviewRequest, userId: number): Promise<IReviewModel> {
    return await prisma.reviews.create({
        data: {
            ...reviewData,
            user_id: userId,
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            rating: true,
            comment: true,
            created_at: true,
            trainers: {
                select: {
                    id: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

export async function getReviewById(reviewId: number): Promise<IReviewModel | null> {
    return await prisma.reviews.findUnique({
        where: {
            id: reviewId
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            rating: true,
            comment: true,
            created_at: true,
            trainers: {
                select: {
                    id: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function updateReviewById(trainerId: number, reviewId: number, comment: string, rating: number): Promise<IReviewModel> {
    return await prisma.reviews.update({
        where: {
            id: reviewId
        },
        data: {
            comment,
            rating,
            trainer_id: trainerId
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            rating: true,
            comment: true,
            created_at: true,
            trainers: {
                select: {
                    id: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function deleteReviewById(reviewId: number) {
    await prisma.reviews.delete({
        where: {
            id: reviewId
        }
    })
}

export async function getAllReviewsByUserId(userId: number): Promise<IReviewModel[]> {
    return await prisma.reviews.findMany({
        where: {
            user_id: userId
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            rating: true,
            comment: true,
            created_at: true,
            trainers: {
                select: {
                    id: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function checkIfReviewExists(userId: number, trainerId?: number, reviewId?: number): Promise<boolean> {
    const review = await prisma.reviews.findFirst({
        where: {
            user_id: userId,
            trainer_id: trainerId ?? null,
            NOT: {
                id: reviewId
            }
        }
    });

    return !!review;
}

export async function getAllReviewsByTrainerId(trainerId: number): Promise<IReviewModel[]> {
    return await prisma.reviews.findMany({
        where: {
            trainer_id: trainerId
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            rating: true,
            comment: true,
            created_at: true,
            trainers: {
                select: {
                    id: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function getAllReviews(): Promise<IReviewModel[]> {
    return await prisma.reviews.findMany({
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    profile_picture: true,
                    persons: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            rating: true,
            comment: true,
            created_at: true,
            trainers: {
                select: {
                    id: true,
                    users: {
                        select: {
                            persons: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function deleteReviewsByUserId(userId: number) {
    await prisma.reviews.deleteMany({
        where: {
            user_id: userId,
        }
    })
}