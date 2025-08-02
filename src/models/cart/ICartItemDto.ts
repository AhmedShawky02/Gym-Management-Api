import { Decimal } from "@prisma/client/runtime/library"

export interface ICartItemDto {
    id: number,
    cart: {
        id: number,
        userId: number
    },
    product_id: number
    product_type: string
    quantity: number,
    created_at: Date | null
    productDetails: {
        id: number,
        name: string,
        price: Decimal,
        description: string,
        image_url: string
    }
}