import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../../config/cloudinaryConfig.js";

export const uploadGallery = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: (req, file) => ({
            folder: `myAppUploads/gallery/Gym/`,
            resource_type: "auto"
        })
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // ✅ النوع مسموح
        } else {
            cb(new Error("Unsupported file type. Only JPEG, PNG, and WEBP are allowed."));
        }
    },
});