import prisma from "../../config/prismaClient.js";
import { IAddToCart } from "../../models/cart/IAddToCart.js";
import { ICart } from "../../models/cart/ICart.js";
import { ICartItem } from "../../models/cart/ICartItem.js";

export async function getCartByUserId(userId: number): Promise<ICart | null> {
    return await prisma.carts.findUnique({
        where: {
            user_id: userId
        },
        select: {
            id: true,
            user_id: true,
            created_at: true
        }
    })
}

export async function createCart(userId: number): Promise<ICart> {
    return await prisma.carts.create({
        data: {
            user_id: userId
        },
        select: {
            id: true,
            user_id: true,
            created_at: true
        }
    })
}

export async function getCartById(cardId: number): Promise<ICart | null> {
    return await prisma.carts.findUnique({
        where: {
            id: cardId
        },
        select: {
            id: true,
            user_id: true,
            created_at: true
        }
    })
}

export async function addToCart(data: IAddToCart, cartId: number): Promise<ICartItem> {
    return await prisma.cart_items.create({
        data: {
            cart_id: cartId,
            ...data
        },
        select: {
            id: true,
            carts: {
                select: {
                    id: true,
                    user_id: true
                }
            },
            product_type: true,
            product_id: true,
            quantity: true,
            created_at: true,
        }
    })
}

export async function getAllCartItemByCardId(cartId: number): Promise<ICartItem[]> {
    return await prisma.cart_items.findMany({
        where: {
            cart_id: cartId
        },
        select: {
            id: true,
            carts: {
                select: {
                    id: true,
                    user_id: true
                }
            },
            product_type: true,
            product_id: true,
            quantity: true,
            created_at: true,
        }
    })
}

export async function getCartItemById(itemId: number): Promise<ICartItem | null> {
    return await prisma.cart_items.findUnique({
        where: {
            id: itemId
        },
        select: {
            id: true,
            carts: {
                select: {
                    id: true,
                    user_id: true
                }
            },
            product_type: true,
            product_id: true,
            quantity: true,
            created_at: true,
        }
    })
}

export async function updateCartItem(itemId: number, quantity: number): Promise<ICartItem> {
    return await prisma.cart_items.update({
        where: {
            id: itemId
        },
        data: {
            quantity
        },
        select: {
            id: true,
            carts: {
                select: {
                    id: true,
                    user_id: true
                }
            },
            product_type: true,
            product_id: true,
            quantity: true,
            created_at: true,
        }
    })
}

export async function deleteCartItem(itemId: number) {
    await prisma.cart_items.delete({
        where: {
            id: itemId
        }
    })
}

export async function deleteCartItemByCardId(cardId: number) {
    await prisma.cart_items.deleteMany({
        where: {
            cart_id: cardId
        }
    })
}

export async function isItemExist(cartId: number, productId: number, productType: string): Promise<ICartItem | null> {
    return await prisma.cart_items.findFirst({
        where: {
            cart_id: cartId,
            product_id: productId,
            product_type: productType
        },
        select: {
            id: true,
            carts: {
                select: {
                    id: true,
                    user_id: true
                }
            },
            product_type: true,
            product_id: true,
            quantity: true,
            created_at: true,
        }
    });
}