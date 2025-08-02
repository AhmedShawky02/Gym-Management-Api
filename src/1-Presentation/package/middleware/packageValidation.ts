import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationCreatePackage = checkSchema({
    name: {
        notEmpty: {
            errorMessage: "Package name is required"
        },
        isString: {
            errorMessage: "Package name must be a string"
        },
        trim: true
    },
    description: {
        notEmpty: {
            errorMessage: "Description is required"
        },
        isString: {
            errorMessage: "Description must be a string"
        },
        trim: true
    },
    price: {
        notEmpty: {
            errorMessage: "Price is required"
        },
        isDecimal: {
            errorMessage: "Price must be a decimal number"
        }
    },
    duration_in_days: {
        notEmpty: {
            errorMessage: "Duration is required"
        },
        isInt: {
            errorMessage: "Duration must be an integer (number of days)"
        }
    }
});

export const ValidationUpdatePackage = checkSchema({
    name: {
        optional: true,
        isString: {
            errorMessage: "Package name must be a string"
        },
    },
    description: {
        optional: true,
        isString: {
            errorMessage: "Description must be a string"
        },
    },
    price: {
        optional: true,
        isDecimal: {
            errorMessage: "Price must be a decimal number"
        }
    },
    duration_in_days: {
        optional: true,
        isInt: {
            errorMessage: "Duration must be an integer (number of days)"
        }
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
