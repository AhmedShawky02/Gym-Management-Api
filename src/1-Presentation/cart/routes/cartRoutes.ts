import { Router } from "express";
import * as CartController from "../../../2-Business/cart/controller/cartController.js";
import { ValidationAddToCart, ValidationUpdateCartItem, validate } from "../../cart/middleware/cartValidation.js"

const router: Router = Router();

router.post("/", ValidationAddToCart, validate, CartController.addToCart);
router.get("/", CartController.getAllCartItem);
router.put("/:itemId", ValidationUpdateCartItem, validate, CartController.updateCartItem);
router.delete("/:itemId", CartController.removeCartItem);


export default router;
