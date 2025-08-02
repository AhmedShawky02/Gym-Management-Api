export interface IBookingForTrainer {
    id: number;
    booking_date: Date | null;
    status_id: number | null;
    users: {
        id: number;
        email: string;
        persons: {
            first_name: string;
            middle_name: string | null;
            last_name: string | null;
        } | null;
    } | null;
    classes: {
        id: number;
        title: string;
        capacity: number | null;
        created_at: Date,
        class_date: Date,
        start_time: string,
        end_time: string
    } | null;
    booking_statuses: {
        id: number;
        name: string;
    } | null;
}
