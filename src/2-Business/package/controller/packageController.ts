import { Request, Response } from 'express';
import * as PackageService from "../../../2-Business/package/service/packageService.js";
import { HttpError } from '../../../utils/HttpError.js';
import { IPackageBasicDto } from '../../../models/package/IPackageBasicDto.js';
import { ICreatePackageRequest } from '../../../models/package/ICreatePackageRequest.js';
import { IUpdatePackageRequest } from '../../../models/package/IUpdatePackageRequest.js';

export async function createPackage(req: Request, res: Response) {
    try {
        const packageData: ICreatePackageRequest = req.body;
        const packageDto: IPackageBasicDto = await PackageService.createPackage(packageData);
        res.status(201).json(packageDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllPackages(req: Request, res: Response) {
    try {
        const packagesDto: IPackageBasicDto[] = await PackageService.getAllPackages();
        res.status(200).json(packagesDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updatePackage(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Package ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Package ID must be a number." });
            return;
        }

        const packageData: IUpdatePackageRequest = req.body;

        if (!packageData || Object.keys(packageData).length === 0) {
            throw new HttpError("At least one field is required to update package.", 400);
        }

        const packageDto: IPackageBasicDto = await PackageService.updatePackage(packageData, id);
        res.status(200).json(packageDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deletePackage(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Package ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Package ID must be a number." });
            return;
        }

        await PackageService.deletePackage(id);
        res.status(200).json({ message: "Package deleted successfully." });
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}
