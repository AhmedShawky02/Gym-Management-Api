import { Request, Response } from 'express';
import { HttpError } from '../../../utils/HttpError.js';
import * as AvailabilityService from "../../../2-Business/trainer/service/trainerAvailabilityService.js";
import { ICreateAvailability } from '../../../models/trainer/trainerAvailability/ICreateAvailability.js';
import { IUpdateAvailability } from '../../../models/trainer/trainerAvailability/IUpdateAvailability.js';

export async function addAvailability(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const data: ICreateAvailability = req.body;
        const createdAvailability = await AvailabilityService.addAvailability(userId, data);

        res.status(201).json(createdAvailability);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyAvailability(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const availability = await AvailabilityService.getMyAvailability(userId);
        res.status(200).json(availability);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateAvailability(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const idParam = req.params.id;
        if (!idParam) {
            res.status(400).json({ message: "Availability ID is required." });
            return;
        }
        const AvailabilityId = Number(idParam);
        if (isNaN(AvailabilityId)) {
            res.status(400).json({ message: "Availability ID must be a number." });
            return;
        }

        const data: IUpdateAvailability = req.body;

        if (!data || Object.keys(data).length === 0) {
            throw new HttpError("At least one field is required to update availability.", 400);
        }

        const updated = await AvailabilityService.updateAvailability(userId, AvailabilityId, data);
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

export async function deleteAvailability(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const idParam = req.params.id;
        if (!idParam) {
            res.status(400).json({ message: "Availability ID is required." });
            return;
        }
        const availabilityId = Number(idParam);
        if (isNaN(availabilityId)) {
            res.status(400).json({ message: "Availability ID must be a number." });
            return;
        }

        await AvailabilityService.deleteAvailability(userId, availabilityId);
        res.status(200).json({ message: "Availability deleted successfully." });

    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAvailabilityByTrainerId(req: Request, res: Response) {
    try {

        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Availability ID is required." });
            return;
        }

        const trainerId = Number(idParam);
        if (isNaN(trainerId)) {
            res.status(400).json({ message: "Availability ID must be a number." });
            return;
        }
        const availabilities = await AvailabilityService.getAvailabilityByTrainerId(trainerId);
        res.status(200).json(availabilities);

    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}
