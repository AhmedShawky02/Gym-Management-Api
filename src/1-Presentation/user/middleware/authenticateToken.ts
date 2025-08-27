import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access token is missing." });
        return
    }

    jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Invalid or expired token." });
            return
        }

        const payload = decoded as jwt.JwtPayload & {
            userId: number;
            roles: string[];
        };

        req.user = {
            userId: payload.userId,
            roles: payload.roles
        };

        next();
    });
}