import { checkSchema, validationResult, matchedData } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const ValidationCreatePayment = checkSchema({
    packageId: {
        optional: true,
        isInt: {
            errorMessage: "Package ID must be an integer."
        },
    },
    bookingId: {
        optional: true,
        isInt: {
            errorMessage: "Booking ID must be an integer."
        },
    },
    cart_id: {
        optional: true,
        isInt: {
            errorMessage: "Cart ID must be an integer."
        },
    },
});

export const ValidationUpdatePaymentStatus = checkSchema({
    status_id: {
        notEmpty: {
            errorMessage: "Status ID requited."

        },
        isInt: {
            errorMessage: "Booking ID must be an integer."
        },
    },
});


export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    req.body = matchedData(req);
    next();
};
