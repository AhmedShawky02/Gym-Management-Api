import { Request, Response } from 'express';
import * as TrainerService from "../../../2-Business/trainer/service/adminTrainerService.js";
import { HttpError } from '../../../utils/HttpError.js';
import { ITrainerBasicDto } from '../../../models/trainer/ITrainerBasicDto.js';
import { IUpdateTrainer } from '../../../models/trainer/IUpdateTrainer.js';
import { ICreateTrainer } from '../../../models/trainer/ICreateTrainer.js';

export async function getAllTrainers(req: Request, res: Response) {
    try {
        const trainersDto: ITrainerBasicDto[] = await TrainerService.getAllTrainers();
        res.status(200).json(trainersDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getTrainerByUserId(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Trainer ID is required." });
            return;
        }

        const id = Number(idParam);

        if (isNaN(id)) {
            res.status(400).json({ message: "Trainer ID must be a number." });
            return;
        }

        const trainerDto: ITrainerBasicDto = await TrainerService.getTrainerByUserId(id);

        res.status(200).json(trainerDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateTrainer(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Trainer ID is required." });
            return;
        }

        const trainerId = Number(idParam);

        if (isNaN(trainerId)) {
            res.status(400).json({ message: "Trainer ID must be a number." });
            return;
        }

        const trainerData: IUpdateTrainer = req.body;

        if (!trainerData || Object.keys(trainerData).length === 0) {
            throw new HttpError("At least one field is required to update trainer.", 400);
        }

        const trainerDto: ITrainerBasicDto = await TrainerService.updateTrainer(trainerData, trainerId);

        res.status(200).json(trainerDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteTrainer(req: Request, res: Response) {
    try {
        const idParam = req.params.id;
        if (!idParam) {
            res.status(400).json({ message: "Trainer ID is required." });
            return;
        }
        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Trainer ID must be a number." });
            return;
        }
        await TrainerService.deleteTrainer(id);
        res.status(200).json({ message: "Trainer and assigned role deleted successfully." });
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function addTrainer(req: Request, res: Response) {
    try {
        const trainerData: ICreateTrainer = req.body;
        const trainerDto: ITrainerBasicDto = await TrainerService.addTrainer(trainerData);
        res.status(201).json(trainerDto);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}
