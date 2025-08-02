import { Request, Response } from 'express';
import * as UserService from "../../../2-Business/user/service/userService.js"
import { HttpError } from '../../../utils/HttpError.js';
import { IUserBasicDto } from '../../../models/user/IUserBasicDto.js';
import { IUpdateUserRequest } from '../../../models/user/IUpdateUserRequest.js';
import { IUserFullProfileDto } from '../../../models/user/IUserFullProfileDto.js';

export async function getAllUsers(req: Request, res: Response) {
    try {
        const usersDto: IUserBasicDto[] = await UserService.getAllUsers();
        res.status(200).json(usersDto)
    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;


        if (!idParam) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "User ID must be a number." });
            return;
        }

        const fullUserDto: IUserBasicDto | IUserFullProfileDto = await UserService.getUserById(id);
        res.status(200).json(fullUserDto)

    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "User ID must be a number." });
            return;
        }

        const userData: IUpdateUserRequest = req.body

        if (!userData || Object.keys(userData).length === 0) {
            throw new HttpError("At least one field is required to update user.", 400);
        }
        
        const userDto: IUserBasicDto = await UserService.updateUser(userData, id);
        res.status(200).json(userDto)
    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const idParam = req.params.id;


        if (!idParam) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "User ID must be a number." });
            return;
        }

        await UserService.deleteUser(id);
        res.status(200).json({ message: "User and associated person data deleted successfully." });
    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

