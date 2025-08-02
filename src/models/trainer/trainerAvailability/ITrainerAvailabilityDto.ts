export interface ITrainerAvailabilityDto {
    id: number,
    week_day: {
        week_day_id?: number,
        week_day_name?: string,
    },
    start_time: string,
    end_time: string,
    created_at: Date
}
