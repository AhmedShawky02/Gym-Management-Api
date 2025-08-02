import prisma from "../../config/prismaClient.js";
import axios from "axios";
import { ICreatePaymentRequest } from "../../models/payment/ICreatePaymentRequest.js";
import { IUsersDto } from "../../models/user/IUsersDto.js";
import { IPaymobPaymentResult } from "../../models/payment/IPaymobPaymentResult.js";
import { ICreatePayment } from "../../models/payment/IcreatePayment.js";
import { IPaymentsDb } from "../../models/payment/IPaymentsDb.js";
import { IPaymentStatus } from "../../models/payment/IPaymentStatus.js";
import { ICreatePaymentItem } from "../../models/payment/ICreatePaymentItem.js";

export async function createPaymentLink(bodyData: ICreatePaymentRequest, user: IUsersDto, allPrice: number): Promise<IPaymobPaymentResult> {
    // Step 1 - Authenticate with Paymob
    const authResponse = await axios.post<{ token: string }>('https://accept.paymob.com/api/auth/tokens', {
        api_key: process.env.PAYMOB_API_KEY
    });

    const authToken = authResponse.data.token;

    // Step 2 - Create order
    const orderResponse = await axios.post<{ id: number }>('https://accept.paymob.com/api/ecommerce/orders', {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(allPrice * 100),
        currency: 'EGP',
        items: []
    });

    const orderId = orderResponse.data.id;

    // Step 3 - Generate payment key
    const paymentKeyResponse = await axios.post<{ token: string }>('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: authToken,
        amount_cents: Math.round(allPrice * 100),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
            email: user.email,
            first_name: user.persons.first_name,
            last_name: user.persons.last_name,
            phone_number: "00000000000",
            apartment: "NA",
            floor: "NA",
            street: "NA",
            building: "NA",
            city: "NA",
            country: "NA",
            state: "NA"
        },
        currency: 'EGP',
        integration_id: Number(process.env.PAYMOB_INTEGRATION_ID)
    });

    const paymentKey = paymentKeyResponse.data.token;

    return { paymentKey, orderId };
}

export async function createPayment(orderId: number, bodyData: ICreatePaymentRequest, user: IUsersDto, allPrice: number): Promise<ICreatePayment> {
    return await prisma.payments.create({
        data: {
            user_id: user.id,
            package_id: bodyData.packageId,
            booking_id: bodyData.bookingId,
            cart_id: bodyData.cart_id,
            amount: allPrice,
            status_id: 1, // Pending
            paymob_order_id: orderId,
            paid_at: new Date()
        },
        select: {
            id: true,
            user_id: true,
            package_id: true,
            booking_id: true,
            cart_id: true,
            amount: true,
            status_id: true,
            paymob_order_id: true,
            paid_at: true,
        }
    })
}

export async function createPaymentItem(data: ICreatePaymentItem) {
    return await prisma.payment_items.create({ data });
}

export async function getPaymentByOrderId(orderId: number): Promise<ICreatePayment | null> {
    return await prisma.payments.findUnique({
        where: {
            paymob_order_id: orderId
        },
        select: {
            id: true,
            user_id: true,
            package_id: true,
            booking_id: true,
            cart_id: true,
            amount: true,
            status_id: true,
            paymob_order_id: true,
            paid_at: true,
        }
    })
}

export async function updatePaymentStatusByOrderId(orderId: number, statusId: number) {
    await prisma.payments.update({
        where: {
            paymob_order_id: orderId
        },
        data: {
            status_id: statusId
        }
    })
}

export async function getPaymentsByUserId(userId: number): Promise<IPaymentsDb[]> {
    return await prisma.payments.findMany({
        where: {
            user_id: userId
        },
        select: {
            id: true,
            users: {
                select: {
                    email: true,
                    persons: {
                        select: {
                            first_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            amount: true,
            paid_at: true,
            payment_statuses: {
                select: {
                    name: true,
                }
            },
        },
        orderBy: {
            id: "asc",
        }
    });
}

export async function getAllPayments(): Promise<IPaymentsDb[]> {
    return await prisma.payments.findMany({
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    email: true,
                    persons: {
                        select: {
                            first_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            amount: true,
            paid_at: true,
            payment_statuses: {
                select: {
                    name: true,
                }
            },
        },
        orderBy: {
            id: "asc",
        }
    })
}

export async function getPaymentById(paymentId: number): Promise<IPaymentsDb | null> {
    return await prisma.payments.findUnique({
        where: {
            id: paymentId,
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    email: true,
                    persons: {
                        select: {
                            first_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            amount: true,
            paid_at: true,
            payment_statuses: {
                select: {
                    name: true,
                }
            },
        }
    })
}

export async function getPaymentStatusById(statusId: number): Promise<IPaymentStatus | null> {
    return await prisma.payment_statuses.findUnique({
        where: {
            id: statusId,
        },
        select: {
            id: true,
            name: true,
        }
    })
}

export async function updatePaymentStatusById(statusId: number, paymentId: number): Promise<IPaymentsDb> {
    return await prisma.payments.update({
        where: {
            id: paymentId,
        },
        data: {
            status_id: statusId,
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    email: true,
                    persons: {
                        select: {
                            first_name: true,
                            last_name: true,
                        }
                    }
                }
            },
            amount: true,
            paid_at: true,
            payment_statuses: {
                select: {
                    name: true,
                }
            },
        }
    })
}

export async function deletePaymentsByUserId(userId: number) {
    await prisma.payments.deleteMany({
        where: {
            user_id: userId,
        }
    })
}