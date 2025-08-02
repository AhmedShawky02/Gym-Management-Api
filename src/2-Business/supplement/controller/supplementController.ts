import { Request, Response } from "express";
import * as SupplementService from "../../supplement/service/supplementService.js";
import { HttpError } from "../../../utils/HttpError.js";
import { ICreateSupplementRequest } from "../../../models/supplement/ICreateSupplementRequest.js";
import { IUpdateSupplementRequest } from "../../../models/supplement/IUpdateSupplementRequest.js";
import { ISupplementDto } from "../../../models/supplement/ISupplementDto.js";
import { uploadImageToCloudinary } from "../../../utils/uploadImageToCloudinary.js";
import { ISupplementModel } from "../../../models/supplement/ISupplementModel.js";
import { extractPublicIdFromUrl } from "../../../utils/extractPublicIdFromUrl.js";
import cloudinary from "../../../config/cloudinaryConfig.js";

export async function addSupplement(req: Request, res: Response) {
    try {
        if (!req.file) {
            throw new HttpError("Image is Required.", 400)
        }

        const uploadResult = await uploadImageToCloudinary(
            req.file,
            "myAppUploads/supplement"
        );

        const imageUrl = uploadResult.url;

        const data: ICreateSupplementRequest = req.body;

        const supplement: any = await SupplementService.addSupplement(data, imageUrl);

        res.status(201).json(supplement);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateSupplement(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "Supplement ID must be a number." });
            return;
        }

        const supplement: ISupplementModel = await SupplementService.getSupplementById(id)

        let imageUrl = supplement.image_url;

        if (req.file) {
            if (imageUrl) {
                const publicId = extractPublicIdFromUrl(imageUrl);
                await cloudinary.uploader.destroy(publicId);
            }
            // لو فيه صورة جديدة، ارفعها
            const uploadResult = await uploadImageToCloudinary(
                req.file,
                "myAppUploads/supplement"
            );
            imageUrl = uploadResult.url;
        }

        const data: IUpdateSupplementRequest = req.body;

        if (!data || Object.keys(data).length === 0) {
            throw new HttpError("At least one field is required to update supplement.", 400);
        }

        const updated: ISupplementDto = await SupplementService.updateSupplement(id, data, imageUrl);

        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllSupplements(req: Request, res: Response) {
    try {
        const supplements: ISupplementDto[] = await SupplementService.getAllSupplements();

        res.status(200).json(supplements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getSupplementsById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Supplement ID is required." });
            return;
        }

        const supplementId = Number(idParam);
        if (isNaN(supplementId)) {
            res.status(400).json({ message: "Supplement ID must be a number." });
            return;
        }

        const supplementDto: ISupplementDto = await SupplementService.getSupplementById(supplementId);
        res.status(200).json(supplementDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteSupplement(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Supplement ID must be a number." });
            return;
        }

        await SupplementService.deleteSupplement(id);
        res.status(200).json({ message: "Supplement deleted successfully." });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

