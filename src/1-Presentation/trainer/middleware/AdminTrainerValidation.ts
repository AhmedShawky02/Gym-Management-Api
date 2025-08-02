import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationAddTrainer = checkSchema({
    user_id: {
        isInt: { errorMessage: "user_id must be an integer" },
        notEmpty: { errorMessage: "user_id is required" },
    },
    bio: {
        notEmpty: { errorMessage: "bio is required" },
        isString: { errorMessage: "bio must be a string" }
    },
    experience_years: {
        notEmpty: { errorMessage: "experience_years is required" },
        isInt: { errorMessage: "experience_years must be an integer" }
    },
    specialization: {
        notEmpty: { errorMessage: "specialization is required" },
        isString: { errorMessage: "specialization must be a string" },
        isLength: {
            options: { max: 100 },
            errorMessage: "specialization must be at most 100 characters"
        }
    },
    private_monthly_price: {
        notEmpty: {
            errorMessage: "private_price is required"
        },
        isDecimal: {
            errorMessage: "private_price must be a decimal number"
        }
    },
});


export const ValidationUpdateTrainer = checkSchema({
    bio: {
        optional: true,
        isString: { errorMessage: "bio must be a string" }
    },
    experience_years: {
        optional: true,
        isInt: { errorMessage: "experience_years must be an integer" }
    },
    specialization: {
        optional: true,
        isString: { errorMessage: "specialization must be a string" },
        isLength: {
            options: { max: 100 },
            errorMessage: "specialization must be at most 100 characters"
        }
    },
    private_monthly_price: {
        optional: true,
        isDecimal: {
            errorMessage: "private_price must be a decimal number"
        }
    },
});


export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return
    }

    req.body = matchedData(req);

    next();
}