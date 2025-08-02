import * as PackageRepo from "../../../3-DataAccess/package/packageRepo.js";
import { HttpError } from "../../../utils/HttpError.js";
import { IPackagesDto } from "../../../models/package/IPackagesDto.js";
import { IPackageBasicDto } from "../../../models/package/IPackageBasicDto.js";
import { ICreatePackageRequest } from "../../../models/package/ICreatePackageRequest.js";
import { IUpdatePackageRequest } from "../../../models/package/IUpdatePackageRequest.js";
import { mapPackageToDto, mapPackagesToDto } from "../../../mapping/packageMapper.js";

export async function createPackage(packageData: ICreatePackageRequest): Promise<IPackageBasicDto> {

    const normalizedName = packageData.name.trim().toLowerCase();

    const existing = await PackageRepo.getPackageByName(normalizedName);
    if (existing) {
        throw new HttpError("Package name already exists", 400);
    }

    try {
        const created: IPackagesDto = await PackageRepo.createPackage({
            ...packageData,
            name: normalizedName,
        });

        return mapPackageToDto(created);
    } catch (err: any) {
        if (err.code === 'P2002') {
            throw new HttpError("Package name already exists", 400);
        }

        throw err;
    }
}

export async function getAllPackages(): Promise<IPackageBasicDto[]> {
    const packages: IPackagesDto[] = await PackageRepo.getAllPackages();

    if (!packages || packages.length === 0) {
        throw new HttpError("Packages not found.", 404);
    }

    return mapPackagesToDto(packages);
}

export async function updatePackage(packageData: IUpdatePackageRequest, packageId: number): Promise<IPackageBasicDto> {
    const thePackage: IPackagesDto | null = await PackageRepo.getPackageById(packageId);

    if (!thePackage) {
        throw new HttpError("Package not found.", 404);
    }

    if (packageData.name) {
        const normalizedName = packageData.name.trim().toLowerCase();

        const existing = await PackageRepo.getPackageByName(normalizedName);
        if (existing && existing.id !== packageId) {
            throw new HttpError("Package name already exists", 400);
        }
    }

    const price = Number(packageData.price);
    if (!isNaN(price) && price < 0) {
        throw new HttpError("Price cannot be less than 0", 400);
    }

    const duration = Number(packageData.duration_in_days);
    if (!isNaN(duration) && duration < 0) {
        throw new HttpError("Duration (in days) cannot be less than 0", 400);
    }

    try {
        const updated: IPackagesDto = await PackageRepo.updatePackage(packageData, packageId);

        const updatedDto: IPackageBasicDto = mapPackageToDto(updated);

        return updatedDto

    } catch (err: any) {
        if (err.code === 'P2002') {
            throw new HttpError("Package name already exists", 400);
        }

        throw err;
    }

}

export async function deletePackage(packageId: number) {
    const existing: IPackagesDto | null = await PackageRepo.getPackageById(packageId);

    if (!existing) {
        throw new HttpError("Package not found.", 404);
    }

    await PackageRepo.deletePackage(packageId);
}
