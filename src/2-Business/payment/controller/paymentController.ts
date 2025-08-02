import { Request, Response } from 'express';
import * as PaymentService from "../../../2-Business/payment/service/paymentService.js";
import { HttpError } from '../../../utils/HttpError.js';
import { IPaymentLinkResponse } from '../../../models/payment/IPaymentLinkResponse.js';
import { ICreatePaymentRequest } from '../../../models/payment/ICreatePaymentRequest.js';
import { IPaymentBasicDto } from '../../../models/payment/IPaymentBasicDto.js';

export async function createPayment(req: Request, res: Response) {
    try {
        const bodyData: ICreatePaymentRequest = req.body;

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const paymentLink: IPaymentLinkResponse = await PaymentService.createPaymentLink(bodyData, userId);

        res.status(201).json({ URL: paymentLink.url, Data: paymentLink.paymentData });
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const handlePaymobWebhook = async (req: Request, res: Response) => {
    try {

        await PaymentService.handlePaymobWebhook(req.body);

        res.status(200).json({ message: "Webhook received" });
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function getMyPayments(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const paymentsDto: IPaymentBasicDto[] = await PaymentService.getUserPayments(userId);
        res.status(200).json(paymentsDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}
//------------------------------------------------------

export async function getAllPayments(req: Request, res: Response) {
    try {

        const paymentsDto: IPaymentBasicDto[] = await PaymentService.getAllPayments();
        res.status(200).json(paymentsDto);

    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updatePaymentStatusById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Payment ID is required." });
            return;
        }

        const paymentId = Number(idParam);
        if (isNaN(paymentId)) {
            res.status(400).json({ message: "Payment ID must be a number." });
            return;
        }

        const { status_id }: { status_id: number } = req.body

        const updatedDto: IPaymentBasicDto = await PaymentService.updatePaymentStatusById(paymentId, status_id)
        res.status(200).json(updatedDto);

    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}