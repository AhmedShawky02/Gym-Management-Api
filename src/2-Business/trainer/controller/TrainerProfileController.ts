import { Request, Response } from 'express';
import * as TrainerService from "../../../2-Business/trainer/service/adminTrainerService.js";
import { HttpError } from '../../../utils/HttpError.js';
import { ITrainerBasicDto } from '../../../models/trainer/ITrainerBasicDto.js';
import { IUpdateTrainer } from '../../../models/trainer/IUpdateTrainer.js';

export async function getMyTrainerProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const trainerDto: ITrainerBasicDto = await TrainerService.getTrainerByUserId(userId);
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

export async function updateMyTrainerProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const trainerData: IUpdateTrainer = req.body;

        if (!trainerData || Object.keys(trainerData).length === 0) {
            throw new HttpError("At least one field is required to update trainer.", 400);
        }
        
        const trainerDto: ITrainerBasicDto = await TrainerService.updateTrainerByUserId(trainerData, userId);
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