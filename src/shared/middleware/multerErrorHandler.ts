// 📁 shared/middleware/multerErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ErrorRequestHandler } from "express";
import multer from "multer";

export const multerErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        // خطأ حجم الملف أو أي خطأ Multer داخلي
        res.status(400).json({ error: err.message });
        return 
    }

    if (err.message?.includes("file type")) {
        // خطأ نوع الملف اللي جاي من fileFilter
        res.status(400).json({ error: err.message });
        return 
    }

    next(err); // باقي الأخطاء (زي HttpError) تمشي عادي
};
