import { ITrainerAvailability } from "../models/trainer/trainerAvailability/ITrainerAvailability";
import { ITrainerAvailabilityDto } from "../models/trainer/trainerAvailability/ITrainerAvailabilityDto.js";

export const mapTrainerAvailabilityToDto = (availability: ITrainerAvailability): ITrainerAvailabilityDto => {
    return {
        id: availability.id,
        week_day: {
            week_day_id: availability.week_days?.id,
            week_day_name: availability.week_days?.name,
        },
        start_time: availability.start_time,
        end_time: availability.end_time,
        created_at: availability.created_at
    };
};

export const mapTrainerAvailabilitiesToDto = (availabilities: ITrainerAvailability[]): ITrainerAvailabilityDto[] => {
    return availabilities.map(mapTrainerAvailabilityToDto)
};
