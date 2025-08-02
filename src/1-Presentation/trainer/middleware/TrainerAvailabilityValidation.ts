import { checkSchema } from "express-validator";

export const ValidationAddAvailability = checkSchema({
    week_day_id: {
        isInt: {
            errorMessage: "week_day_id must be an integer."
        },
        notEmpty: {
            errorMessage: "week_day_id is required."
        }
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


export const ValidationUpdateAvailability = checkSchema({
    week_day_id: {
        optional: true,
        isInt: {
            errorMessage: "week_day_id must be an integer."
        },
        notEmpty: {
            errorMessage: "week_day_id is required."
        }
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
