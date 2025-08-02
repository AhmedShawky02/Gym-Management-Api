import { Request, Response } from 'express';
import * as RoleService from "../../../2-Business/role/service/roleService.js"
import { HttpError } from '../../../utils/HttpError.js';
import { IRoleDto } from '../../../models/role/IRoleDto.js';
import { IRoleWithUsersDto } from '../../../models/role/IRoleWithUsersDto.js';
import { ICreateRole } from '../../../models/role/ICreateRole.js';

export async function getAllRoles(req: Request, res: Response) {
    try {
        const rolesDto: IRoleDto[] = await RoleService.getAllRoles();
        res.status(200).json(rolesDto)

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getRoleWithUsersById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            res.status(400).json({ message: "Role ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Role ID must be a number." });
            return;
        }

        const roleWithUsers: IRoleWithUsersDto[] = await RoleService.getRoleWithUsersByRoleId(id);
        res.status(200).json(roleWithUsers)

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createRole(req: Request, res: Response) {
    try {
        const { name }: { name: string } = req.body;

        const newRole: ICreateRole = await RoleService.createRole(name);
        res.status(201).json(newRole);

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateRole(req: Request, res: Response) {
    try {
        const idParam = req.params.id;


        if (!idParam) {
            res.status(400).json({ message: "Role ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Role ID must be a number." });
            return;
        }

        const { name }: { name: string } = req.body;

        const roleUpdated: ICreateRole = await RoleService.updateRole(id, name);
        res.status(200).json(roleUpdated)

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteRole(req: Request, res: Response) {
    try {
        const idParam = req.params.id;


        if (!idParam) {
            res.status(400).json({ message: "Role ID is required." });
            return;
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({ message: "Role ID must be a number." });
            return;
        }

        await RoleService.deleteRole(id);
        res.status(200).json({ message: "Role deleted successfully." })

    } catch (error) {
        console.log(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}