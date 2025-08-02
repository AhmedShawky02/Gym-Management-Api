import * as SupplementRepo from "../../../3-DataAccess/supplement/supplementRepo.js";
import { HttpError } from "../../../utils/HttpError.js";
import { ICreateSupplementRequest } from "../../../models/supplement/ICreateSupplementRequest.js";
import { IUpdateSupplementRequest } from "../../../models/supplement/IUpdateSupplementRequest.js";
import { ISupplementDto } from "../../../models/supplement/ISupplementDto.js";
import { ISupplementModel } from "../../../models/supplement/ISupplementModel.js";
import { mapSupplementToDto, mapSupplementsToDto } from "../../../mapping/supplementMapper.js";
import { extractPublicIdFromUrl } from "../../../utils/extractPublicIdFromUrl.js";
import cloudinary from "../../../config/cloudinaryConfig.js";

export async function addSupplement(data: ICreateSupplementRequest, imageUrl: string): Promise<ISupplementDto> {

    if (isNaN(data.price)) {
        throw new HttpError("Price must be a number.", 400);
    }

    if (data.price < 0) {
        throw new HttpError("Price must be greater than 0", 400);
    }

    if (isNaN(data.capacity)) {
        throw new HttpError("Capacity must be number.", 404);
    }

    if (data.capacity < 0) {
        throw new HttpError("Capacity must be greater than 0", 400);
    }

    const newSupplement: ISupplementModel = await SupplementRepo.createSupplement(data, imageUrl);

    const newSupplementDto: ISupplementDto = mapSupplementToDto(newSupplement);

    return newSupplementDto
}

export async function getAllSupplements(): Promise<ISupplementDto[]> {
    const supplements: ISupplementModel[] = await SupplementRepo.getAllSupplements();

    if (!supplements || supplements.length === 0) {
        throw new HttpError("Supplements not found.", 404);
    }

    const supplementsDto: ISupplementDto[] = await Promise.all(
        supplements.map(async (supplement) => {
            
            const countPaid: number = await SupplementRepo.countPaidPaymentsBySupplementId(supplement.id);
            console.log(countPaid)// 0
            const remaining_quantity = supplement.capacity - (countPaid ?? 0);
            return mapSupplementToDto(supplement, remaining_quantity);
        })
    );

    return supplementsDto;
}

export async function getSupplementById(supplementId: number): Promise<ISupplementDto> {
    const supplement: ISupplementModel | null = await SupplementRepo.getSupplementById(supplementId)

    if (!supplement) {
        throw new HttpError("Supplement not found.", 404)
    }

    const countPaid: number = await SupplementRepo.countPaidPaymentsBySupplementId(supplement.id);

    const remaining_quantity = supplement.capacity - (countPaid ?? 0);

    const Dto: ISupplementDto = mapSupplementToDto(supplement, remaining_quantity)
    return Dto
}

export async function updateSupplement(id: number, data: IUpdateSupplementRequest, imageUrl: string): Promise<ISupplementDto> {
    const exists: ISupplementModel | null = await SupplementRepo.getSupplementById(id);

    if (!exists) {
        throw new HttpError("Supplement not found.", 404);
    }

    if (data.price != null) {
        if (isNaN(data.price)) {
            throw new HttpError("Price must be a number.", 400);
        }
        if (data.price < 0) {
            throw new HttpError("Price must be greater than 0", 400);
        }
    }

    if (data.capacity != null) {
        if (isNaN(data.capacity)) {
            throw new HttpError("Capacity must be a number.", 400);
        }
        if (data.capacity < 0) {
            throw new HttpError("Capacity must be greater than 0", 400);
        }
    }

    const updated = await SupplementRepo.updateSupplement(id, data, imageUrl);

    const updatedDto: ISupplementDto = mapSupplementToDto(updated);

    return updatedDto
}

export async function deleteSupplement(id: number) {
    const exists: ISupplementModel | null = await SupplementRepo.getSupplementById(id);

    if (!exists) {
        throw new HttpError("Supplement not found.", 404);
    }

    if (exists.image_url) {
        const publicId = extractPublicIdFromUrl(exists.image_url);
        await cloudinary.uploader.destroy(publicId);
    }

    await SupplementRepo.deleteSupplement(id);
}
