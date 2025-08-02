import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { check } from "express-validator";

export const ValidationRegister = checkSchema({
    first_name: {
        notEmpty: {
            errorMessage: 'first_name is required'
        },
        isLength: {
            options: { min: 3, max: 15 },
            errorMessage: 'first_name must be between 3 and 15 characters'
        }
    },
    middle_name: {
        notEmpty: {
            errorMessage: 'middle_name is required'
        },
        isLength: {
            options: { min: 3, max: 15 },
            errorMessage: 'middle_name must be between 3 and 15 characters'
        }
    },
    last_name: {
        notEmpty: {
            errorMessage: 'last_name is required'
        },
        isLength: {
            options: { min: 3, max: 15 },
            errorMessage: 'last_name must be between 3 and 15 characters'
        }
    },
    date_of_birth: {
        notEmpty: {
            errorMessage: 'date_of_birth is required'
        },
        isDate: {
            errorMessage: 'Invalid date_of_birth format'
        },
        toDate: true
    },
    password_hash: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters'
        }
    },
    email: {
        notEmpty: { errorMessage: 'Email is required' },
        isEmail: { errorMessage: 'Invalid email format' }
    },
    gender_type_id: {
        notEmpty: { errorMessage: 'gender_type_id is required' },
        isInt: { errorMessage: 'gender_type_id must be an integer' },
        isIn: {
            options: [[1, 2]],
            errorMessage: 'gender_type_id must be either 1 (Male) or 2 (Female)'
        }
    }
});

export const ValidationLogin = checkSchema({
    password_hash: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters'
        }
    },
    email: {
        notEmpty: { errorMessage: 'Email is required' },
        isEmail: { errorMessage: 'Invalid email format' }
    },
});

export const ValidationUpdateUser = checkSchema({
    first_name: {
        optional: true,
        isLength: {
            options: { min: 3, max: 15 },
            errorMessage: 'first_name must be between 3 and 15 characters'
        }
    },
    middle_name: {
        optional: true,
        isLength: {
            options: { min: 3, max: 15 },
            errorMessage: 'middle_name must be between 3 and 15 characters'
        }
    },
    last_name: {
        optional: true,
        isLength: {
            options: { min: 3, max: 15 },
            errorMessage: 'last_name must be between 3 and 15 characters'
        }
    },
    date_of_birth: {
        optional: true,
        isDate: {
            errorMessage: 'Invalid date_of_birth format'
        },
        toDate: true
    },
    gender_type_id: {
        optional: true,
        isInt: { errorMessage: 'gender_type_id must be an integer' },
        isIn: {
            options: [[1, 2]],
            errorMessage: 'gender_type_id must be either 1 (Male) or 2 (Female)'
        },
        toInt: true
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