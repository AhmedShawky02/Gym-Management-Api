import prisma from "../../config/prismaClient.js";
import { IPackagesDto } from "../../models/package/IPackagesDto.js";
import { ICreatePackageRequest } from "../../models/package/ICreatePackageRequest.js";
import { IUpdatePackageRequest } from "../../models/package/IUpdatePackageRequest.js";

function mapPrismaPackageToDto(p: any): IPackagesDto {
    return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        duration_in_days: p.duration_in_days
    };
}

export async function createPackage(packageData: ICreatePackageRequest): Promise<IPackagesDto> {
    const created = await prisma.packages.create({
        data: {
            ...packageData
        }
    });
    return mapPrismaPackageToDto(created);
}

export async function getPackageByName(name: string) {
    return await prisma.packages.findFirst({
        where: {
            name: {
                equals: name.trim().toLowerCase(),
                mode: 'insensitive',
            },
        },
    });

}

export async function getAllPackages(): Promise<IPackagesDto[]> {
    const packages = await prisma.packages.findMany();
    return packages.map(mapPrismaPackageToDto);
}

export async function getPackageById(packageId: number): Promise<IPackagesDto | null> {
    const p = await prisma.packages.findUnique({
        where: { id: packageId }
    });
    return p ? mapPrismaPackageToDto(p) : null;
}

export async function updatePackage(packageData: IUpdatePackageRequest, packageId: number): Promise<IPackagesDto> {
    const updated = await prisma.packages.update({
        where: { id: packageId },
        data: packageData
    });
    return mapPrismaPackageToDto(updated);
}

export async function deletePackage(packageId: number) {
    await prisma.packages.delete({
        where: { id: packageId }
    });
}

