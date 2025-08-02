import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationCreateReview = checkSchema({
    trainer_id: {
        optional: true,
        notEmpty: {
            errorMessage: "Rating is required"
        },
        isInt: {
            errorMessage: "Rating must be an integer between 1 and 5"
        }
    },
    rating: {
        notEmpty: {
            errorMessage: "Rating is required"
        },
        isInt: {
            options: { min: 1, max: 5 },
            errorMessage: "Rating must be an integer between 1 and 5"
        }
    },
    comment: {
        notEmpty: {
            errorMessage: "Comment is required"
        },
        isString: {
            errorMessage: "Comment must be a string"
        }
    }
});

export const ValidationUpdateReview = checkSchema({
    trainer_id: {
        optional: true,
        notEmpty: {
            errorMessage: "Rating is required"
        },
        isInt: {
            errorMessage: "Rating must be an integer between 1 and 5"
        }
    },
    rating: {
        optional: true,
        notEmpty: {
            errorMessage: "Rating is required"
        },
        isInt: {
            options: { min: 1, max: 5 },
            errorMessage: "Rating must be an integer between 1 and 5"
        }
    },
    comment: {
        optional: true,
        notEmpty: {
            errorMessage: "Comment is required"
        },
        isString: {
            errorMessage: "Comment must be a string"
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
