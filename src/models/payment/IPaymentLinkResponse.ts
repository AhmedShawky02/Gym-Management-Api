import { ICreatePayment } from "./IcreatePayment";

export interface IPaymentLinkResponse {
  url: string;
  paymentData: ICreatePayment
}