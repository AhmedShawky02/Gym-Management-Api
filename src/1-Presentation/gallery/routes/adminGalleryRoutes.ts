import express from "express";
import * as GalleryController from "../../../2-Business/gallery/controller/galleryController.js";
import { ValidationUploadImage, ValidationUpdateImage, validate } from "../middleware/galleryValidation.js";
import { memoryUpload } from "../../../shared/middleware/uploadMemory.js";
import { validateImage } from "../../../shared/middleware/validateImage.js";

const router = express.Router();

// Admin
router.post(
    "/",
    memoryUpload.single("image_url"),
    ...validateImage("image_url", true),
    ValidationUploadImage,
    validate,
    GalleryController.uploadImage
);

router.put(
    "/:id",
    memoryUpload.single("image_url"),
    ...validateImage("image_url", false),
    ValidationUpdateImage,
    validate,
    GalleryController.updateImageById
);

router.get("/", GalleryController.getAllImages)
router.delete("/:id", GalleryController.deleteImage)

export default router;