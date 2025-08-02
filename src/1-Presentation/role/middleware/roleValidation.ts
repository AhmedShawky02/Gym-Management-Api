import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationCreateRole = checkSchema({
    name: {
        isString: {
            errorMessage: "name Must Be string"
        },
        notEmpty: {
            errorMessage: 'name is required'
        },
        isLength: {
            options: { max: 100 },
            errorMessage: "name must not exceed 100 characters"
        },
    }
});

export const ValidationUpdateRole = checkSchema({
    name: {
        isString: {
            errorMessage: "name Must Be string"
        },
        notEmpty: {
            errorMessage: 'name is required'
        },
        isLength: {
            options: { max: 100 },
            errorMessage: "name must not exceed 100 characters"
        },
    }
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