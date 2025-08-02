import { checkSchema, validationResult, matchedData } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const ValidationCreateSupplement = checkSchema({
    name: {
        notEmpty: { errorMessage: "Name is required" },
        isString: { errorMessage: "Name must be a string" },
        trim: true,
    },
    description: {
        notEmpty: { errorMessage: "Description is required" },
        isString: { errorMessage: "Description must be a string" },
        trim: true,
    },
    capacity: {
        isInt: { errorMessage: "Capacity must be an integer" },
        custom: {
            options: (value) => Number(value) > 0,
            errorMessage: "Capacity must be greater than 0",
        },
        toInt: true,
        trim: true,
    },
    price: {
        notEmpty: { errorMessage: "Price is required" },
        isDecimal: { errorMessage: "Price must be a decimal number" },
        custom: {
            options: (value) => Number(value) > 0,
            errorMessage: "Price must be greater than 0",
        },
        trim: true,
    },
});

export const ValidationUpdateSupplement = checkSchema({
    name: {
        optional: true,
        notEmpty: { errorMessage: "Name is required" },
        isString: { errorMessage: "Name must be a string" },
        trim: true,
    },
    description: {
        optional: true,
        notEmpty: { errorMessage: "Description is required" },
        isString: { errorMessage: "Description must be a string" },
        trim: true,
    },
    capacity: {
        optional: true,
        isInt: { errorMessage: "Capacity must be an integer" },
        custom: {
            options: (value) => Number(value) > 0,
            errorMessage: "Capacity must be greater than 0",
        },
        toInt: true,
        trim: true,
    },
    price: {
        optional: true,
        notEmpty: { errorMessage: "Price is required" },
        isDecimal: { errorMessage: "Price must be a decimal number" },
        custom: {
            options: (value) => Number(value) > 0,
            errorMessage: "Price must be greater than 0",
        },
        trim: true
    },
});


export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const data = matchedData(req, { locations: ['body'], includeOptionals: true });

    // Force type conversion manually
    if (data.capacity !== undefined) {
        data.capacity = parseInt(data.capacity, 10);
    }
    if (data.price !== undefined) {
        data.price = parseFloat(data.price);
    }

    req.body = data;

    next();
};
