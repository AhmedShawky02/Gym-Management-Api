import { ISupplementModel } from "../models/supplement/ISupplementModel.js";
import { ISupplementDto } from "../models/supplement/ISupplementDto.js";

export function mapSupplementToDto(s: ISupplementModel, remaining_quantity?: number): ISupplementDto {
    return {
        id: s.id,
        name: s.name,
        description: s.description,
        image_url: s.image_url,
        capacity: s.capacity,
        price: s.price,
        created_at: s.created_at,
        remaining_quantity: remaining_quantity ?? s.capacity
    }
}

export function mapSupplementsToDto(supplements: ISupplementModel[]): ISupplementDto[] {
    return supplements.map(mapSupplementToDto);
}
