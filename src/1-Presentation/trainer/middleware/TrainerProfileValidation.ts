import { checkSchema } from "express-validator";

export const ValidationUpdateMyTrainerProfile = checkSchema({
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
        notEmpty: {
            errorMessage: "private_price is required"
        },
        isDecimal: {
            errorMessage: "private_price must be a decimal number"
        }
    },
}); 