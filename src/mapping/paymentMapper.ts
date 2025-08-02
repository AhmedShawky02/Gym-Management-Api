import { IPaymentBasicDto } from "../models/payment/IPaymentBasicDto";
import { IPaymentsDb } from "../models/payment/IPaymentsDb";

export function mapPaymentToDto(payment: IPaymentsDb): IPaymentBasicDto {
    return {
        id: payment.id,
        user: {
            id: payment.users.id,
            fullName: `${payment.users.persons.first_name} ${payment.users.persons.last_name}`,
            email: payment.users.email,
        },
        amount: payment.amount,
        paid_at: payment.paid_at,
        status: {
            name: payment.payment_statuses.name
        }
    }
}

export function mapPaymentsToDto(payments: IPaymentsDb[]): IPaymentBasicDto[] {
    return payments.map(mapPaymentToDto)
}

