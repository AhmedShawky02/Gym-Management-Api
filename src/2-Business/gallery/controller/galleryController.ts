import { Request, Response } from "express";
import * as GalleryService from "../../../2-Business/gallery/service/galleryService.js";
import { HttpError } from "../../../utils/HttpError.js";
import { ICreateGalleryImageRequest } from "../../../models/gallery/ICreateGalleryImageRequest.js";
import { IGalleryImageDto } from "../../../models/gallery/IGalleryImageDto.js";
import { IUpdateGalleryImageRequest } from "../../../models/gallery/IUpdateGalleryImageRequest.js";
import { IGalleryImageEntity } from "../../../models/gallery/IGalleryImageEntity.js";
import { uploadImageToCloudinary } from "../../../utils/uploadImageToCloudinary.js";
import cloudinary from "../../../config/cloudinaryConfig.js";
import { extractPublicIdFromUrl } from "../../../utils/extractPublicIdFromUrl.js";

export async function uploadImage(req: Request, res: Response) {
    try {
        const imageData: ICreateGalleryImageRequest = req.body;

        if (!req.file) {
            throw new HttpError("Image is Required.", 400)
        }

        const uploadResult = await uploadImageToCloudinary(
            req.file,
            "myAppUploads/gallery/Gym"
        );

        const imageUrl = uploadResult.url;

        const imageDto: IGalleryImageDto = await GalleryService.uploadImage(imageData, imageUrl);
        res.status(201).json(imageDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllImages(req: Request, res: Response) {
    try {
        const imagesDto: IGalleryImageDto[] = await GalleryService.getAllImages();
        res.status(200).json(imagesDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateImageById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Image ID is required." });
            return;
        }

        const ImageId = Number(idParam);
        if (isNaN(ImageId)) {
            res.status(400).json({ message: "Image ID must be a number." });
            return;
        }

        const image: IGalleryImageEntity = await GalleryService.getImageById(ImageId)

        let imageUrl = image.image_url;

        if (req.file) {
            if (imageUrl) {
                const publicId = extractPublicIdFromUrl(imageUrl);
                await cloudinary.uploader.destroy(publicId);
            }
            // لو فيه صورة جديدة، ارفعها
            const uploadResult = await uploadImageToCloudinary(req.file, "myAppUploads/gallery/Gym");
            imageUrl = uploadResult.url;
        }

        const imageData: IUpdateGalleryImageRequest = req.body;

        if (!imageData || Object.keys(imageData).length === 0) {
            throw new HttpError("At least one field is required to update class.", 400);
        }

        const updatedDto: IGalleryImageDto = await GalleryService.updateImageById(ImageId, imageData, imageUrl)
        res.status(200).json(updatedDto);

    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteImage(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Image ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Image ID must be a number." });
            return;
        }

        await GalleryService.deleteImage(id);
        res.status(200).json({ message: "Image deleted successfully." });
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}
