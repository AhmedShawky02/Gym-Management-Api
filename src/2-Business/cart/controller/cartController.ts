import { Request, Response } from "express";
import * as CartService from "../../../2-Business/cart/service/cartService.js";
import { HttpError } from "../../../utils/HttpError.js";
import { IAddToCart } from "../../../models/cart/IAddToCart.js";
import { ICartItemDto } from "../../../models/cart/ICartItemDto.js";
import { IUpdateCartItem } from "../../../models/cart/IUpdateCartItem.js";


export async function addToCart(req: Request, res: Response) {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const data: IAddToCart = req.body;

        const item: ICartItemDto = await CartService.addToCart(userId, data);

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export async function getAllCartItem(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const CartItemDto: ICartItemDto[] = await CartService.getAllCartItem(userId);
        res.status(200).json(CartItemDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export async function updateCartItem(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const itemId = Number(req.params.itemId);

        if (isNaN(itemId)) {
            res.status(400).json({ message: "Invalid item ID." });
            return;
        }

        const data: IUpdateCartItem = req.body;

        const updatedItem: ICartItemDto | undefined = await CartService.updateCartItem(userId, itemId, data);

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export async function removeCartItem(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        
        const itemId = Number(req.params.itemId);

        if (isNaN(itemId)) {
            res.status(400).json({ message: "Invalid item ID." });
            return;
        }

        await CartService.removeCartItem(userId, itemId);

        res.status(200).json({ message: "Item removed from cart." });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
