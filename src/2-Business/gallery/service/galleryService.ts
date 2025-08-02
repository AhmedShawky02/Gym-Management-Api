import * as GalleryRepo from "../../../3-DataAccess/gallery/galleryRepo.js";
import cloudinary from "../../../config/cloudinaryConfig.js";
import { mapGalleryListToDto, mapGalleryToDto } from "../../../mapping/galleryMapper.js";
import { ICreateGalleryImageRequest } from "../../../models/gallery/ICreateGalleryImageRequest.js";
import { IGalleryImageDto } from "../../../models/gallery/IGalleryImageDto.js";
import { IGalleryImageEntity } from "../../../models/gallery/IGalleryImageEntity.js";
import { IUpdateGalleryImageRequest } from "../../../models/gallery/IUpdateGalleryImageRequest.js";
import { extractPublicIdFromUrl } from "../../../utils/extractPublicIdFromUrl.js";
import { HttpError } from "../../../utils/HttpError.js";

export async function uploadImage(data: ICreateGalleryImageRequest, imagePath: string): Promise<IGalleryImageDto> {
    const newImage: IGalleryImageEntity = await GalleryRepo.createImage(data, imagePath);
    const dto: IGalleryImageDto = mapGalleryToDto(newImage);
    return dto;
}

export async function getAllImages(): Promise<IGalleryImageDto[]> {
    const images: IGalleryImageEntity[] = await GalleryRepo.getAllImages();

    if (!images || images.length === 0) {
        throw new HttpError("No images found.", 404);
    }

    const imagesDto: IGalleryImageDto[] = mapGalleryListToDto(images)
    return imagesDto
}

export async function updateImageById(ImageId: number, imageData: IUpdateGalleryImageRequest, imagePath: string): Promise<IGalleryImageDto> {
    const image: IGalleryImageEntity | null = await GalleryRepo.getImageById(ImageId)

    if (!image) {
        throw new HttpError("Image not Found.", 404)
    }

    if (imagePath && image.image_url) {
        const publicId = extractPublicIdFromUrl(image.image_url);
        await cloudinary.uploader.destroy(publicId);
    }

    const updated: IGalleryImageEntity = await GalleryRepo.updateImageById(ImageId, imageData, imagePath)
    const updatedDto: IGalleryImageDto = mapGalleryToDto(updated);
    return updatedDto;
}

export async function getImageById(ImageId: number): Promise<IGalleryImageEntity> {
    const image: IGalleryImageEntity | null = await GalleryRepo.getImageById(ImageId)

    if (!image) {
        throw new HttpError("Image not Found.", 404)
    }

    return image
}

export async function deleteImage(ImageId: number): Promise<void> {
    const image: IGalleryImageEntity | null = await GalleryRepo.getImageById(ImageId)

    if (!image) {
        throw new HttpError("Image not found.", 404);
    }
    
    if (image.image_url) {
        const publicId = extractPublicIdFromUrl(image.image_url);
        await cloudinary.uploader.destroy(publicId);
    }

    await GalleryRepo.deleteImage(ImageId);
}
