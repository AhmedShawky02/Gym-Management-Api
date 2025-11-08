import { checkSchema, validationResult, matchedData } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const ValidationAddToCart = checkSchema({
    product_type: {
        in: ['body'],
        isString: true,
        isIn: {
            // options: ['supplement', 'book', 'phone'],
            options: ['supplement'],
            errorMessage: "product_type must be 'supplement'"
        },
        errorMessage: "product_type must be provided and valid"
    },
    product_id: {
        in: ['body'],
        isInt: true,
        toInt: true,
        errorMessage: "product_id must be a number"
    },
    quantity: {
        in: ['body'],
        isInt: { options: { min: 0 } },
        toInt: true,
        errorMessage: "quantity must be a positive number"
    }
});

export const ValidationUpdateCartItem = checkSchema({
    quantity: {
        in: ['body'],
        isInt: { options: { min: 1 } },
        toInt: true,
        errorMessage: "quantity must be a positive number"
    }
});

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return
    }

    req.body = matchedData(req);
    next();
};
