import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationAssignUserRole = checkSchema({
    user_id: {
        isInt: {
            errorMessage: "user_id Must Be number"
        },
        notEmpty: {
            errorMessage: 'user_id is required'
        }
    },
    role_id: {
        isInt: {
            errorMessage: "role_id Must Be number"
        },
        notEmpty: {
            errorMessage: 'role_id is required'
        }
    },
});

export const ValidationUpdateUserRole = checkSchema({
    role_id: {
        isInt: {
            errorMessage: "role_id Must Be number"
        },
        notEmpty: {
            errorMessage: 'role_id is required'
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