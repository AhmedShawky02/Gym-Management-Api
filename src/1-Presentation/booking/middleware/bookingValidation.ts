import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationCreateBooking = checkSchema({
    trainer_id: {
        optional: true,
        isInt: true,
        toInt: true,
        errorMessage: "Trainer ID is required and must be an integer."
    },
    class_id: {
        optional: true,
        isInt: true,
        toInt: true,
        errorMessage: "Class ID must be an integer."
    }
});

export const ValidationChangeBookingStatus = checkSchema({
    status_id: {
        isInt: true,
        toInt: true,
        errorMessage: "Status ID is required and must be an integer."
    }
});

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    req.body = matchedData(req);

    next();
}
