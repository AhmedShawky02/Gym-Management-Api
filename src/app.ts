import express, { Express } from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
//----------------------------------------------------------------------------------
import authRoutes from "./1-Presentation/user/routes/authRoutes.js";
import userRoutes from "./1-Presentation/user/routes/userRoutes.js"
import roleRoutes from "./1-Presentation/role/routes/roleRoutes.js";
import profileRoutes from "./1-Presentation/user/routes/profileRoutes.js"
import userRoleRoutes from "./1-Presentation/userRole/routes/userRoleRoutes.js"
import adminTrainerRoutes from "./1-Presentation/trainer/routes/adminTrainerRoutes.js";
import trainerProfileRoutes from "./1-Presentation/trainer/routes/trainerProfileRoutes.js";
import trainerAvailabilityRoutes from "./1-Presentation/trainer/routes/trainerAvailabilityRoutes.js"
import publicTrainerAvailabilityRoutes from "./1-Presentation/trainer/routes/publicTrainerAvailabilityRoutes.js";
import publicTrainerRoutes from "./1-Presentation/trainer/routes/publicTrainerRoutes.js";
import classRoutes from "./1-Presentation/class/routes/classesRoutes.js";
import publicClassesRoutes from "./1-Presentation/class/routes/publicClassesRoutes.js";
import bookingAdminRoutes from "./1-Presentation/booking/routes/bookingAdminRoutes.js";
import bookingTrainerRoutes from "./1-Presentation/booking/routes/bookingTrainerRoutes.js";
import bookingUserRoutes from "./1-Presentation/booking/routes/bookingUserRoutes.js";
import packageRoutes from "./1-Presentation/package/routes/packageRoutes.js"
import publicPackageRoutes from "./1-Presentation/package/routes/publicPackageRoutes.js";
import userPaymentRoutes from "./1-Presentation/payment/routes/userPaymentRoutes.js";
import paymentRoutes from "./1-Presentation/payment/routes/paymentRoutes.js";
import adminPaymentRoutes from "./1-Presentation/payment/routes/adminPaymentRoutes.js";
import userReviewRoutes from "./1-Presentation/Review/routes/userReviewRoutes.js"
import trainerReviewRoutes from "./1-Presentation/Review/routes/trainerReviewRoutes.js"
import adminReviewRoutes from "./1-Presentation/Review/routes/adminReviewRoutes.js"
import adminSupplementRoutes from "./1-Presentation/supplement/routes/adminSupplementRoutes.js"
import userSupplementRoutes from "./1-Presentation/supplement/routes/userSupplementRoutes.js"
import adminGalleryRoutes from "./1-Presentation/gallery/routes/adminGalleryRoutes.js"
import userGalleryRoutes from "./1-Presentation/gallery/routes/userGalleryRoutes.js"
import cartRoutes from "./1-Presentation/cart/routes/cartRoutes.js"
//----------------------------------------------------------------------------------
import { authenticateToken } from "./1-Presentation/user/middleware/authenticateToken.js";
import { authorizeRoles } from "./1-Presentation/user/middleware/authorizeRoles.js";
import { multerErrorHandler } from "./shared/middleware/multerErrorHandler.js";
import { publicLimiter, authenticatedLimiter } from "./shared/middleware/rateLimitMiddleware.js";

//----------------------------------------------------------------------------------

const app: Express = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", publicLimiter, authRoutes) //---------------------------------------------------------------------------------------✅
app.use("/api/payments", publicLimiter, paymentRoutes); // WeebHook ---------------------------------------------------------------------✅

// Public GET
app.use("/api/public/trainers-availability", authenticatedLimiter, publicTrainerAvailabilityRoutes); //----------------------------------✅
app.use("/api/public/trainers", authenticatedLimiter, publicTrainerRoutes); //-----------------------------------------------------------✅
app.use("/api/user/packages", authenticatedLimiter, publicPackageRoutes); //-------------------------------------------------------------✅
app.use("/api/user/classes", authenticatedLimiter, publicClassesRoutes); //--------------------------------------------------------------✅
app.use("/api/user/supplement", authenticatedLimiter, userSupplementRoutes); //----------------------------------------------------------✅
app.use("/api/user/gallery", authenticatedLimiter, userGalleryRoutes); //----------------------------------------------------------------✅

//User GET POST PUT DELETE
app.use("/api/user/profile", authenticateToken, authorizeRoles(["User"]), authenticatedLimiter, profileRoutes); //-----------------------✅
app.use("/api/user/review", authenticateToken, authorizeRoles(["User"]), authenticatedLimiter, userReviewRoutes) //----------------------✅
app.use("/api/user/booking", authenticateToken, authorizeRoles(["User"]), authenticatedLimiter, bookingUserRoutes); //-------------------✅
app.use("/api/user/payment", authenticateToken, authorizeRoles(["User"]), authenticatedLimiter, userPaymentRoutes); //-------------------✅
app.use("/api/user/cart", authenticateToken, authorizeRoles(["User"]), authenticatedLimiter, cartRoutes); //-----------------------------✅

//Admin
app.use("/api/admin/payment", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, adminPaymentRoutes); //----------------✅
app.use("/api/admin/booking", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, bookingAdminRoutes); //----------------✅
app.use("/api/admin/user", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, userRoutes) //----------------------------✅
app.use("/api/admin/role", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, roleRoutes) //----------------------------✅
app.use("/api/admin/user-role", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, userRoleRoutes) //-------------------✅
app.use("/api/admin/trainer", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, adminTrainerRoutes) //-----------------✅
app.use("/api/admin/package", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, packageRoutes); //---------------------✅
app.use("/api/admin/review", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, adminReviewRoutes); //------------------✅
app.use("/api/admin/supplement", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, adminSupplementRoutes); //----------✅
app.use("/api/admin/gallery", authenticateToken, authorizeRoles(["Admin"]), authenticatedLimiter, adminGalleryRoutes); //----------------✅

//Trainer
app.use("/api/trainer/booking", authenticateToken, authorizeRoles(["Trainer"]), authenticatedLimiter, bookingTrainerRoutes); //----------✅
app.use("/api/trainer/profile", authenticateToken, authorizeRoles(["Trainer"]), authenticatedLimiter, trainerProfileRoutes); //----------✅
app.use("/api/trainer/availability", authenticateToken, authorizeRoles(["Trainer"]), authenticatedLimiter, trainerAvailabilityRoutes) //-✅
app.use("/api/trainer/class", authenticateToken, authorizeRoles(["Trainer"]), authenticatedLimiter, classRoutes); //---------------------✅
app.use("/api/trainer/review", authenticateToken, authorizeRoles(["Trainer"]), authenticatedLimiter, trainerReviewRoutes) //-------------✅


app.use(multerErrorHandler); // multer بيتعامل بس مع أخطاء 

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Global Error Handler
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

export default app;
