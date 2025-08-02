export interface IPaymobWebhookDto {
    obj: {
        id: number;
        order: {
            id: number;
        };
        amount_cents: number;
        success: boolean;
        pending: boolean,
    };
}