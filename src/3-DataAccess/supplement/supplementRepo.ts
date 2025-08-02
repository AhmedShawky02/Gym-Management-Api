import prisma from "../../config/prismaClient.js";
import { ICreateSupplementRequest } from "../../models/supplement/ICreateSupplementRequest.js";
import { ISupplementModel } from "../../models/supplement/ISupplementModel.js";
import { IUpdateSupplementRequest } from "../../models/supplement/IUpdateSupplementRequest.js";

export async function createSupplement(data: ICreateSupplementRequest, imageUrl: string): Promise<ISupplementModel> {
    return await prisma.supplements.create({
        data: {
            ...data,
            image_url: imageUrl
        },
        select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
            capacity: true,
            price: true,
            created_at: true
        }
    });
}

export async function getAllSupplements(): Promise<ISupplementModel[]> {
    return await prisma.supplements.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
            capacity: true,
            price: true,
            created_at: true,
        },
    });
}

export async function countPaidPaymentsBySupplementId(supplementId: number): Promise<number> {
    const count = await prisma.payment_items.count({
        where: {
            product_type: "supplement",
            product_id: supplementId,
            payments: {
                status_id: 2 // فقط المدفوع
            }
        }
    });
    return count;
}


export async function getSupplementById(id: number): Promise<ISupplementModel | null> {
    return await prisma.supplements.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
            capacity: true,
            price: true,
            created_at: true,
        },
    });
}

export async function updateSupplement(id: number, data: IUpdateSupplementRequest, imageUrl: string): Promise<ISupplementModel> {
    return await prisma.supplements.update({
        where: { id },
        data: {
            ...data,
            image_url: imageUrl
        },
        select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
            capacity: true,
            price: true,
            created_at: true
        }
    });
}

export async function deleteSupplement(id: number): Promise<void> {
    await prisma.supplements.delete({
        where: { id }
    });
}
