import { Request, Response } from 'express';
import { HttpError } from '../../../utils/HttpError.js';
import * as TrainerService from "../../../2-Business/trainer/service/TrainerService.js";
import { ITrainerAndUserDto } from '../../../models/trainer/ITrainerAndUserDto.js';


export async function getAllTrainers(req: Request, res: Response) {
    try {

        const trainers: ITrainerAndUserDto[] = await TrainerService.getAllTrainers();

        res.status(201).json(trainers);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}