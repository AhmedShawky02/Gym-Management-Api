// shared/middleware/rateLimitMiddleware.ts
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

// بعد تسجيل الدخول (userId موجود)
export const authenticatedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // لكل يوزر
    keyGenerator: (req: Request) => {
        const userId = (req as any).user?.userId;
        // لو فيه يوزر، استعمل الـ userId، غير كده استخدم ipKeyGenerator
        return userId || ipKeyGenerator(req.ip!);
    },
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});

// قبل تسجيل الدخول (مافيش userId)

export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    keyGenerator: (req, res) => ipKeyGenerator(req.ip!), // ✅ كده صح
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});
