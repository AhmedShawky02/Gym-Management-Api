import prisma from "../../config/prismaClient.js";
import { ICreateGalleryImageRequest } from "../../models/gallery/ICreateGalleryImageRequest.js";
import { IGalleryImageEntity } from "../../models/gallery/IGalleryImageEntity.js";
import { IUpdateGalleryImageRequest } from "../../models/gallery/IUpdateGalleryImageRequest.js";

export async function createImage(data: ICreateGalleryImageRequest, imagePath: string): Promise<IGalleryImageEntity> {
    return await prisma.gallery.create({
        data: {
            ...data,
            image_url: imagePath
        },
        select: {
            id: true,
            image_url: true,
            title: true,
            description: true,
            uploaded_at: true
        }
    });
}

export async function getAllImages(): Promise<IGalleryImageEntity[]> {
    return await prisma.gallery.findMany({
        select: {
            id: true,
            image_url: true,
            title: true,
            description: true,
            uploaded_at: true
        },
        orderBy: {
            uploaded_at: "desc"
        }
    });
}

export async function getImageById(id: number): Promise<IGalleryImageEntity | null> {
    return await prisma.gallery.findUnique({
        where: { id },
        select: {
            id: true,
            image_url: true,
            title: true,
            description: true,
            uploaded_at: true
        }
    });
}

export async function updateImageById(imageId: number, imageData: IUpdateGalleryImageRequest, imagePath: string): Promise<IGalleryImageEntity> {
    return await prisma.gallery.update({
        where: {
            id: imageId
        },
        data: {
            ...imageData,
            image_url: imagePath
        },
        select: {
            id: true,
            image_url: true,
            title: true,
            description: true,
            uploaded_at: true
        }
    })
}

export async function deleteImage(id: number): Promise<void> {
    await prisma.gallery.delete({ where: { id } });
}
