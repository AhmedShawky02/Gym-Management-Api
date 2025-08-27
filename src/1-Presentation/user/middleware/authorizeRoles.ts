import { Request, Response, NextFunction } from "express";

export function authorizeRoles(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {

        const user = req.user as { userId: number; roles: string[] } | undefined;

        if (!user || !user.roles) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const hasRole = user.roles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            res.status(403).json({ message: "You do not have permission." });
            return
        }

        next();
    };
}
