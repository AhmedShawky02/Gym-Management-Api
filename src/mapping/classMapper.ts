import { IClassEntity } from "../models/class/IClassEntity.js";
import { IClassDto } from "../models/class/IClassDto.js";

export function mapClassToDto(classEntity: IClassEntity): IClassDto {
    return {
        id: classEntity.id,
        trainer: {
            trainer_id: classEntity.trainers.id,
            fullName: `${classEntity.trainers.users.persons.first_name} ${classEntity.trainers.users.persons.middle_name} ${classEntity.trainers.users.persons.last_name}`
        },
        title: classEntity.title,
        created_at: classEntity.created_at,
        description: classEntity.description,
        capacity: classEntity.capacity,
        price: classEntity.price,
        class_date: classEntity.class_date,
        start_time: classEntity.start_time,
        end_time: classEntity.end_time,
        currentBookingsCount:classEntity._count?.bookings
    };
}

export function mapClassesToDto(classEntities: IClassEntity[]): IClassDto[] {
    return classEntities.map(mapClassToDto);
}
