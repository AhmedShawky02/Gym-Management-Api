import { ICartItemDto } from "./ICartItemDto.js";

export interface ICartDto {
    cart_id: number;
    items: ICartItemDto[];
}
