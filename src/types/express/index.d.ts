import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roles: string[];
      };
    }
  }
}


declare module "express-serve-static-core" {
  interface Request {
    rawBody?: Buffer;
  }
}