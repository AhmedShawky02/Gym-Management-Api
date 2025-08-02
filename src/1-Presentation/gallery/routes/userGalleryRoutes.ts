import express from "express";
import * as GalleryController from "../../../2-Business/gallery/controller/galleryController.js";

const router = express.Router();

// User
router.get("/", GalleryController.getAllImages);

export default router;