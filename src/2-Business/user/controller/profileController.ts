import { Request, Response } from 'express';
import * as UserService from "../../../2-Business/user/service/userService.js"
import { HttpError } from '../../../utils/HttpError.js';
import { IUserBasicDto } from '../../../models/user/IUserBasicDto.js';
import { IUpdateUserRequest } from '../../../models/user/IUpdateUserRequest.js';
import { IUserFullProfileDto } from '../../../models/user/IUserFullProfileDto.js';
import { extractPublicIdFromUrl } from '../../../utils/extractPublicIdFromUrl.js';
import cloudinary from '../../../config/cloudinaryConfig.js';
import { uploadImageToCloudinary } from '../../../utils/uploadImageToCloudinary.js';

export async function getMyProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const fullUserDto: IUserBasicDto | IUserFullProfileDto = await UserService.getUserById(userId);
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

export async function updateMyProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user: IUserFullProfileDto = await UserService.getUserById(userId)

        let imageUrl = user.profile_picture;

        if (req.file) {
            if (imageUrl && imageUrl.trim() !== "") {
                const publicId = extractPublicIdFromUrl(imageUrl);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
                await cloudinary.uploader.destroy(publicId);
            }
            // لو فيه صورة جديدة، ارفعها
            const uploadResult = await uploadImageToCloudinary(
                req.file,
                `myAppUploads/users/${userId}`
            );
            imageUrl = uploadResult.url;
        }

        const userData: IUpdateUserRequest = req.body

        if (!userData || Object.keys(userData).length === 0) {
            throw new HttpError("At least one field is required to update user.", 400);
        }

        const userDto: IUserBasicDto = await UserService.updateUser(userData, userId, imageUrl);
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
