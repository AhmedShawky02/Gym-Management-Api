import { IGalleryImageDto } from "../models/gallery/IGalleryImageDto";
import { IGalleryImageEntity } from "../models/gallery/IGalleryImageEntity";

export function mapGalleryToDto(entity: IGalleryImageEntity): IGalleryImageDto {
    return {
        id: entity.id,
        image_url: entity.image_url,
        title: entity.title,
        description: entity.description,
        uploaded_at: entity.uploaded_at
    };
}

export function mapGalleryListToDto(entity: IGalleryImageEntity[]): IGalleryImageDto[] {
    return entity.map(mapGalleryToDto)
}