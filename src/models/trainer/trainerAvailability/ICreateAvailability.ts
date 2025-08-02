export interface ICreateAvailability {
    week_day_id: number;
    start_time: string; // ISO time string e.g. "08:00:00"
    end_time: string;   // ISO time string
}
