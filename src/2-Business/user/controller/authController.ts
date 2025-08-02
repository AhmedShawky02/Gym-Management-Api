import { Request, Response } from 'express';
import * as authService from "../../../2-Business/user/service/authService.js"
import { ICreateUser } from '../../../models/user/ICreateUser.js';
import { IUserDto } from '../../../models/user/IUserDto.js';
import { HttpError } from '../../../utils/HttpError.js';
import { ILoginUser } from '../../../models/user/ILoginUser.js';

export async function register(req: Request, res: Response) {
    try {
        const UserData: ICreateUser = req.body

        const UserDto: IUserDto = await authService.createUser(UserData)

        res.status(201).json(UserDto);

    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req: Request, res: Response) {
    try {

        const loginData: ILoginUser = req.body;

        const userDto: IUserDto = await authService.validateUserCredentials(loginData.email, loginData.password_hash);

        const accessToken = authService.generateAccessToken(userDto);
        const refreshToken = authService.generateRefreshToken(userDto);
        await authService.storeRefresh(userDto.id, refreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // http = false || https = true
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function refresh(req: Request, res: Response) {
    try {
        const refreshToken: string = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token" });
            return
        }

        const userId: number = await authService.verifyAndGetUserIdFromRefresh(refreshToken!);

        const user: IUserDto = await authService.getUserById(userId);

        const newAccessToken: string = authService.generateAccessToken(user);

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        const refreshToken: string = req.cookies.refreshToken;

        if (refreshToken) {
            await authService.removeRefreshToken(refreshToken);
        }

        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error(error)

        if (error instanceof HttpError) {
            res.status(error.status).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}