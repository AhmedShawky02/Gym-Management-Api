import { IBookingEntity } from "../models/booking/IBookingEntity.js";
import { IBookingBasicDto } from "../models/booking/IBookingBasicDto.js";
import { IBookingForTrainer } from "../models/booking/IBookingForTrainer";
import { IBookingTrainerDto } from "../models/booking/IBookingTrainerDto";

export function mapBookingEntityToDto(entity: IBookingEntity): IBookingBasicDto {
    const dto: any = {
        id: entity.id,
        user_id: entity.user_id,
        booking_date: entity.booking_date,
        status: entity.booking_statuses
            ? {
                id: entity.booking_statuses.id,
                name: entity.booking_statuses.name,
            }
            : null,
    };

    if (entity.trainers) {
        dto.trainer = {
            id: entity.trainers.id,
            fullName: `${entity.trainers?.users.persons.first_name} ${entity.trainers?.users.persons.middle_name} ${entity.trainers?.users.persons.last_name}`,
            private_monthly_price: entity.trainers.private_monthly_price,
        };
    }

    if (entity.classes) {
        dto.class = {
            id: entity.classes?.id,
            title: entity.classes?.title,
            description: entity.classes?.description,
        };
    }

    return dto;
}


export function mapBookingForTrainerToDto(entity: IBookingForTrainer): IBookingTrainerDto {
    const dto: any = {
        id: entity.id,
        bookingDate: entity.booking_date,
        status: entity.booking_statuses
            ? {
                id: entity.booking_statuses.id,
                name: entity.booking_statuses.name,
            }
            : null,
        user: entity.users
            ? {
                id: entity.users.id,
                email: entity.users.email,
                fullName: entity.users.persons
                    ? `${entity.users.persons.first_name} ${entity.users.persons.middle_name} ${entity.users.persons.last_name}`
                    : null,
            }
            : null,
    };

    if (entity.classes) {
        dto.class = {
            id: entity.classes.id,
            title: entity.classes.title,
            created_at: entity.classes.created_at,
            class_date: entity.classes.class_date,
            start_time: entity.classes.start_time,
            end_time: entity.classes.end_time,
            capacity: entity.classes.capacity,
        }
    }
    return dto
}

export function mapManyBookingsForTrainer(entities: IBookingForTrainer[]): IBookingTrainerDto[] {
    return entities.map(mapBookingForTrainerToDto);
}
