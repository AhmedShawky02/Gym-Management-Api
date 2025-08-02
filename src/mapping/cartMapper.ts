import { ICartItem } from "../models/cart/ICartItem";
import { ICartItemDto } from "../models/cart/ICartItemDto";
import { ISupplementModel } from "../models/supplement/ISupplementModel";

export function mapCartItemToDto(item: ICartItem, productDetails?: ISupplementModel | null): ICartItemDto {
    const dto: any = {
        id: item.id,
        cart: {
            id: item.carts.id,
            userId: item.carts.user_id
        },
        product_id: item.product_id,
        product_type: item.product_type,
        quantity: item.quantity,
        created_at: item.created_at
    };

    if (productDetails) {
        dto.productDetails = {
            id: productDetails.id,
            name: productDetails.name,
            price: productDetails.price,
            description: productDetails.description,
            image_url: productDetails.image_url
        }
    }

    return dto
}
