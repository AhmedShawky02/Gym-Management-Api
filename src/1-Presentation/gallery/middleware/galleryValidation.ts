import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData, check } from "express-validator";

export const ValidationUploadImage = checkSchema({
    title: {
        optional: true,
        isString: {
            errorMessage: "Title must be a string"
        },
        isLength: {
            options: { max: 100 },
            errorMessage: "Title can be up to 100 characters"
        }
    },
    description: {
        optional: true,
        isString: {
            errorMessage: "Description must be a string"
        }
    }
});

export const ValidationUpdateImage = checkSchema({
    title: {
        optional: true,
        isString: {
            errorMessage: "Title must be a string"
        },
        isLength: {
            options: { max: 100 },
            errorMessage: "Title can be up to 100 characters"
        }
    },
    description: {
        optional: true,
        isString: {
            errorMessage: "Description must be a string"
        }
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

