import * as CartRepo from "../../../3-DataAccess/cart/cartRepo.js";
import * as UserRepo from "../../../3-DataAccess/user/userRepo.js"
import * as SupplementRepo from "../../../3-DataAccess/supplement/supplementRepo.js"
import { HttpError } from "../../../utils/HttpError.js";
import { IUsersDto } from "../../../models/user/IUsersDto.js";
import { IAddToCart } from "../../../models/cart/IAddToCart.js";
import { ICart } from "../../../models/cart/ICart.js";
import { ICartItem } from "../../../models/cart/ICartItem.js";
import { ISupplementModel } from "../../../models/supplement/ISupplementModel.js";
import { mapCartItemToDto } from "../../../mapping/cartMapper.js";
import { ICartItemDto } from "../../../models/cart/ICartItemDto.js";
import { IUpdateCartItem } from "../../../models/cart/IUpdateCartItem.js";

export async function addToCart(userId: number, data: IAddToCart): Promise<ICartItemDto> {

    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("Unauthorized.", 401)
    }

    let cart: ICart | null = await CartRepo.getCartByUserId(userId);

    if (!cart) {
        cart = await CartRepo.createCart(userId);
        if (!cart) throw new HttpError("Failed to create cart", 400);
    }

    if (data.product_type === "supplement") {
        const supplement: ISupplementModel | null = await SupplementRepo.getSupplementById(data.product_id)

        if (!supplement) {
            throw new HttpError("supplement not found.", 404);
        }

        const existingItem: ICartItem | null = await CartRepo.isItemExist(cart.id, data.product_id, data.product_type);


        if (existingItem) {
            // لو موجود نزود الكمية

            const totalQuantity = data.quantity + existingItem.quantity

            if (totalQuantity > supplement.capacity) {
                throw new HttpError("Not enough stock available", 400);
            }

            const updated: ICartItem = await CartRepo.updateCartItem(existingItem.id, totalQuantity);

            return mapCartItemToDto(updated, supplement);
        }
    }

    const item: ICartItem = await CartRepo.addToCart(data, cart.id);

    if (!item) {
        throw new HttpError("Failed to add item to cart", 500);
    }

    let productDetails = null;
    if (data.product_type === "supplement") {
        productDetails = await SupplementRepo.getSupplementById(data.product_id);
    }

    return mapCartItemToDto(item, productDetails);

}

export async function updateCartItem(userId: number, itemId: number, data: IUpdateCartItem): Promise<ICartItemDto | undefined> {
    const existingItem = await CartRepo.getCartItemById(itemId);

    if (!existingItem || existingItem.carts.user_id !== userId) {
        throw new HttpError("Item not found or unauthorized", 404);
    }

    if (data.quantity === undefined) {
        throw new HttpError("Quantity is required", 400);
    }

    if (data.quantity <= 0) {
        throw new HttpError("Quantity must be greater than 0", 400);
    }

    const updated: ICartItem = await CartRepo.updateCartItem(itemId, data.quantity);

    let productDetails = null;

    if (updated.product_type === "supplement") {
        productDetails = await SupplementRepo.getSupplementById(updated.product_id);
    }

    return mapCartItemToDto(updated, productDetails);

}


export async function getAllCartItem(userId: number): Promise<ICartItemDto[]> {
    const user: IUsersDto | null = await UserRepo.getUserById(userId);

    if (!user) {
        throw new HttpError("Unauthorized.", 401)
    }

    const cart: ICart | null = await CartRepo.getCartByUserId(userId);

    if (!cart) {
        throw new HttpError("Cart not found.", 401)
    }

    const items: ICartItem[] = await CartRepo.getAllCartItemByCardId(cart.id)

    if (!items || items.length === 0) {
        return [];
    }
    const enrichedItems: ICartItemDto[] = await Promise.all(items.map(async (item) => {
        let productDetails = null;

        if (item.product_type === "supplement") {
            productDetails = await SupplementRepo.getSupplementById(item.product_id);
        }

        return mapCartItemToDto(item, productDetails);
    }));

    return enrichedItems
}


export async function removeCartItem(userId: number, itemId: number): Promise<void> {
    const existingItem = await CartRepo.getCartItemById(itemId);

    if (!existingItem || existingItem.carts.user_id !== userId) {
        throw new HttpError("Item not found or unauthorized", 404);
    }

    await CartRepo.deleteCartItem(itemId);
}
