import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";

export const ValidationCreateClass = checkSchema({
    title: {
        notEmpty: {
            errorMessage: 'Title is required.'
        },
        isString: {
            errorMessage: 'Title must be a string.'
        },
        isLength: {
            options: { max: 100 },
            errorMessage: 'Title must not exceed 100 characters.'
        },
    },
    description: {
        isString: {
            errorMessage: 'Description must be a string.'
        },
    },
    capacity: {
        isInt: {
            options: { min: 1 },
            errorMessage: 'Capacity must be a positive integer.'
        },
    },
    price: {
        notEmpty: {
            errorMessage: "Price is required"
        },
        isDecimal: {
            errorMessage: "Price must be a decimal number"
        }
    },
    class_date: {
        notEmpty: {
            errorMessage: "created_at is required"
        },
        isISO8601: {
            errorMessage: "Created_at must be a valid ISO 8601 date."
        },
    },
    start_time: {
        notEmpty: {
            errorMessage: "Start time is required"
        },
        matches: {
            options: [/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/],
            errorMessage: "Start time must be in HH:mm:ss format"
        }
    },
    end_time: {
        notEmpty: {
            errorMessage: "End time is required"
        },
        matches: {
            options: [/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/],
            errorMessage: "End time must be in HH:mm:ss format"
        }
    }
});


export const ValidationUpdateClass = checkSchema({
    title: {
        optional: true,
        notEmpty: {
            errorMessage: 'Title is required.'
        },
        isString: {
            errorMessage: 'Title must be a string.'
        },
        isLength: {
            options: { max: 100 },
            errorMessage: 'Title must not exceed 100 characters.'
        },
    },
    description: {
        optional: true,
        isString: {
            errorMessage: 'Description must be a string.'
        },
    },
    capacity: {
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'Capacity must be a positive integer.'
        },
    },
    price: {
        optional: true,
        notEmpty: {
            errorMessage: "Price is required"
        },
        isDecimal: {
            errorMessage: "Price must be a decimal number"
        }
    },
    class_date: {
        optional: true,
        notEmpty: {
            errorMessage: "created_at is required"
        },
        isISO8601: {
            errorMessage: "Created_at must be a valid ISO 8601 date."
        },
    },
    start_time: {
        optional: true,
        notEmpty: {
            errorMessage: "Start time is required"
        },
        matches: {
            options: [/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/],
            errorMessage: "Start time must be in HH:mm:ss format"
        }
    },
    end_time: {
        optional: true,
        notEmpty: {
            errorMessage: "End time is required"
        },
        matches: {
            options: [/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/],
            errorMessage: "End time must be in HH:mm:ss format"
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
};
