import { Request, Response } from 'express';
import * as UserRoleService from "../../../2-Business/userRole/service/userRoleService.js"
import { HttpError } from '../../../utils/HttpError.js';
import { IAssignRoleRequest } from '../../../models/userRole/IAssignRoleRequest.js';
import { IUpdateUserRoleRequest } from '../../../models/userRole/IUpdateUserRoleRequest.js';
import { IAssignedUserRoleViewDto } from '../../../models/userRole/IAssignedUserRoleViewDto.js';
import { IUserRoleDto } from '../../../models/userRole/IUserRoleDto.js';
import { IAllUserRolesView } from '../../../models/user/IAllUserRolesView.js';

export async function assignRoleToUser(req: Request, res: Response) {
    try {
        const { user_id, role_id }: IAssignRoleRequest = req.body
        const assignedRole = await UserRoleService.assignRoleToUser(user_id, role_id)
        res.status(201).json(assignedRole)

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateUserRole(req: Request, res: Response) {
    try {
        const idParam: string = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "UserRole ID is required." });
            return;
        }

        const user_role_id: number = Number(idParam);
        if (isNaN(user_role_id)) {
            res.status(400).json({ message: "UserRole ID must be a number." });
            return;
        }

        const { role_id }: IUpdateUserRoleRequest = req.body;

        const updatedUserRole: IUserRoleDto = await UserRoleService.updateUserRole(user_role_id, role_id)
        res.status(200).json(updatedUserRole)

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteUserRole(req: Request, res: Response) {
    try {
        const idParam: string = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "UserRole ID is required." });
            return;
        }

        const user_role_id: number = Number(idParam);
        if (isNaN(user_role_id)) {
            res.status(400).json({ message: "UserRole ID must be a number." });
            return;
        }


        await UserRoleService.deleteUserRole(user_role_id)
        res.status(200).json({ message: "UserRole deleted successfully." })

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getRolesForUser(req: Request, res: Response) {
    try {
        const idParam: string = req.params.userId;

        if (!idParam) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }

        const userId: number = Number(idParam);
        if (isNaN(userId)) {
            res.status(400).json({ message: "User ID must be a number." });
            return;
        }

        const UserRoles: IAllUserRolesView[] = await UserRoleService.getRolesForUser(userId)
        res.status(200).json(UserRoles)

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}