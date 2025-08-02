import { Request, Response } from 'express';
import * as ClassService from "../../../2-Business/class/service/classService.js";
import { HttpError } from '../../../utils/HttpError.js';
import { ICreateClassRequest } from '../../../models/class/ICreateClassRequest.js';
import { IUpdateClassRequest } from '../../../models/class/IUpdateClassRequest.js';
import { IClassDto } from '../../../models/class/IClassDto.js';

export async function createMyClass(req: Request, res: Response) {
    try {
        const classData: ICreateClassRequest = req.body;

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const classDto: IClassDto = await ClassService.createClass(classData, userId);
        res.status(201).json(classDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyClasses(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const classesDto: IClassDto[] = await ClassService.getMyClasses(userId);
        res.status(200).json(classesDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getClassToUserById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }

        const classId = Number(idParam);
        if (isNaN(classId)) {
            res.status(400).json({ message: "Class ID must be a number." });
            return;
        }

        const classesDto: IClassDto = await ClassService.getClassToUserById(classId);
        res.status(200).json(classesDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllClasses(req: Request, res: Response) {
    try {
        const classesDto: IClassDto[] = await ClassService.getAllClasses();
        res.status(200).json(classesDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyClassById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }

        const classId = Number(idParam);
        if (isNaN(classId)) {
            res.status(400).json({ message: "Class ID must be a number." });
            return;
        }

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const classDto: IClassDto = await ClassService.getClassById(classId, userId);
        res.status(200).json(classDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateClass(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }

        const classId = Number(idParam);
        if (isNaN(classId)) {
            res.status(400).json({ message: "Class ID must be a number." });
            return;
        }

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const classData: IUpdateClassRequest = req.body;


        if (!classData || Object.keys(classData).length === 0) {
            throw new HttpError("At least one field is required to update class.", 400);
        }

        const classDto: IClassDto = await ClassService.updateClass(classData, classId, userId);
        res.status(200).json(classDto);
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteMyClass(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }

        const classId = Number(idParam);
        if (isNaN(classId)) {
            res.status(400).json({ message: "Class ID must be a number." });
            return;
        }

        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        await ClassService.deleteClass(classId, userId);
        res.status(200).json({ message: "Class deleted successfully." });
    } catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}
