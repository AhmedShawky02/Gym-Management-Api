import * as PaymentRepo from "../../../3-DataAccess/payment/paymentRepo.js";
import * as BookingRepo from "../../../3-DataAccess/booking/bookingRepo.js"
import * as PackageRepo from "../../../3-DataAccess/package/packageRepo.js"
import * as CartRepo from "../../../3-DataAccess/cart/cartRepo.js"
import * as SupplementRepo from "../../../3-DataAccess/supplement/supplementRepo.js"
import { IPaymentLinkResponse } from "../../../models/payment/IPaymentLinkResponse.js";
import { HttpError } from "../../../utils/HttpError.js";
import * as UserRepo from "../../../3-DataAccess/user/userRepo.js";
import { IUsersDto } from "../../../models/user/IUsersDto.js";
import { ICreatePaymentRequest } from "../../../models/payment/ICreatePaymentRequest.js";
import { IBookingEntity } from "../../../models/booking/IBookingEntity.js";
import { IPackagesDto } from "../../../models/package/IPackagesDto.js";
import { IPaymobPaymentResult } from "../../../models/payment/IPaymobPaymentResult.js";
import { ICreatePayment } from "../../../models/payment/IcreatePayment.js";
import { IPaymobWebhookDto } from "../../../models/payment/IPaymobWebhookDto.js";
import { IPaymentsDb } from "../../../models/payment/IPaymentsDb.js";
import { mapPaymentsToDto, mapPaymentToDto } from "../../../mapping/paymentMapper.js";
import { IPaymentBasicDto } from "../../../models/payment/IPaymentBasicDto.js";
import { IPaymentStatus } from "../../../models/payment/IPaymentStatus.js";
import { ISupplementModel } from "../../../models/supplement/ISupplementModel.js";
import { ICart } from "../../../models/cart/ICart.js";
import { ICartItem } from "../../../models/cart/ICartItem.js";

export async function createPaymentLinkToBookingOrPackage(bodyData: ICreatePaymentRequest, userId: number): Promise<IPaymentLinkResponse> {
    let allPrice: number = 0
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("Unauthorized.", 401);
    }

    if (!bodyData.bookingId && !bodyData.packageId) {
        throw new HttpError("At least one of bookingId or packageId required to create a payment.", 400);
    }

    if (bodyData.bookingId) {
        const booking: IBookingEntity | null = await BookingRepo.getBookingById(bodyData.bookingId);
        if (!booking) {
            throw new HttpError("Invalid bookingId", 400);
        }

        if (booking.trainers?.id) {
            allPrice += Number(booking.trainers.private_monthly_price)
        }

        if (booking.classes?.id) {
            allPrice += Number(booking.classes.price)
        }
    }

    if (bodyData.packageId) {
        const Package: IPackagesDto | null = await PackageRepo.getPackageById(bodyData.packageId);
        if (!Package) {
            throw new HttpError("Invalid packageId", 400);
        }

        allPrice += Number(Package.price)
    }

    if (allPrice <= 0) {
        throw new HttpError("All Price must be greater than 0", 400);
    }

    const paymentToken: IPaymobPaymentResult = await PaymentRepo.createPaymentLink(user, allPrice);

    if (!paymentToken) {
        throw new HttpError("Token creation error", 400);
    }

    const paymentData: ICreatePayment = await PaymentRepo.createPaymentLinkToBookingOrPackage(paymentToken.orderId, bodyData, user, allPrice)

    return {
        url: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken.paymentKey}`,
        paymentData
    };
}

export async function createPaymentLinkToCart(userId: number) {
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("Unauthorized.", 401);
    }

    const Cart: ICart | null = await CartRepo.getCartByUserId(userId);

    if (!Cart) {
        throw new HttpError("Cart not Found.", 404);
    }

    const items: ICartItem[] = await CartRepo.getAllCartItemByCardId(Cart.id)

    if (!items || items.length === 0) {
        throw new HttpError("Cart is empty.", 400);
    }

    let allPrice = 0;
    await Promise.all(items.map(async (item) => {

        if (item.product_type === "supplement") {
            const supplement: ISupplementModel | null = await SupplementRepo.getSupplementById(item.product_id);

            if (!supplement) {
                throw new HttpError("Supplement not found.", 404);
            }

            allPrice += Number(supplement.price) * item.quantity;
        }

    }));

    const paymentToken: IPaymobPaymentResult = await PaymentRepo.createPaymentLink(user, allPrice);

    if (!paymentToken) {
        throw new HttpError("Token creation error", 400);
    }

    const paymentData: ICreatePayment = await PaymentRepo.createPaymentLinkToCart(paymentToken.orderId, Cart.id, user, allPrice)

    return {
        url: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken.paymentKey}`,
        paymentData
    };
}


export async function handlePaymobWebhook(webhookData: IPaymobWebhookDto) {
    const transactionId = webhookData.obj.id;
    const orderId = webhookData.obj.order.id;
    const amount = webhookData.obj.amount_cents;
    const pending = webhookData.obj.pending;
    const success = webhookData.obj.success;

    if (pending !== false || success !== true) {
        throw new HttpError("Invalid webhook data", 400);
    }

    if (!transactionId || !orderId) {
        throw new HttpError("Invalid webhook data", 400);
    }

    if (!success) {
        await PaymentRepo.updatePaymentStatusByOrderId(orderId, 3); //Failed

        throw new HttpError("Payment failed: transaction was not successful", 400);
    }

    const payment = await PaymentRepo.getPaymentByOrderId(orderId);

    if (!payment) {
        throw new HttpError("Payment not found.", 404);
    }

    if (Math.round(Number(payment.amount) * 100) !== Number(amount)) {
        throw new HttpError("Invalid payment amount.", 400);
    }

    await PaymentRepo.updatePaymentStatusByOrderId(orderId, 2); //Paid

    if (payment.cart_id) {
        const cartItems: ICartItem[] = await CartRepo.getAllCartItemByCardId(payment.cart_id);

        await Promise.all(
            cartItems.map(async (item) => {
                let priceSnapshot = 0;

                if (item.product_type === "supplement") {
                    const supplement = await SupplementRepo.getSupplementById(item.product_id);
                    if (!supplement) return;
                    priceSnapshot = Number(supplement.price);
                }

                await PaymentRepo.createPaymentItem({
                    payment_id: payment.id,
                    product_id: item.product_id,
                    product_type: item.product_type,
                    quantity: item.quantity,
                    price_snapshot: priceSnapshot,
                });
            })
        );

        await CartRepo.deleteCartItemByCardId(payment.cart_id)
    }
}

export async function getUserPayments(userId: number): Promise<IPaymentBasicDto[]> {
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("Unauthorized.", 401);
    }

    const payments: IPaymentsDb[] = await PaymentRepo.getPaymentsByUserId(userId);

    if (!payments || payments.length === 0) {
        throw new HttpError("No payments found.", 404);
    }

    const paymentsDto: IPaymentBasicDto[] = mapPaymentsToDto(payments)
    return paymentsDto
}

export async function getAllPayments(): Promise<IPaymentBasicDto[]> {
    const payments: IPaymentsDb[] = await PaymentRepo.getAllPayments();

    if (!payments || payments.length === 0) {
        throw new HttpError("No payments found.", 404);
    }

    const paymentsDto: IPaymentBasicDto[] = mapPaymentsToDto(payments)
    return paymentsDto
}

export async function updatePaymentStatusById(paymentId: number, status_id: number): Promise<IPaymentBasicDto> {
    const payment: IPaymentsDb | null = await PaymentRepo.getPaymentById(paymentId)

    if (!payment) {
        throw new HttpError("Payment not found.", 404)
    }

    const existsStatus: IPaymentStatus | null = await PaymentRepo.getPaymentStatusById(status_id)

    if (!existsStatus) {
        throw new HttpError("Status not found.", 404)
    }

    const updated: IPaymentsDb = await PaymentRepo.updatePaymentStatusById(existsStatus.id, payment.id)

    const updatedDto: IPaymentBasicDto = mapPaymentToDto(updated);

    return updatedDto
}