import multer from "multer";

export const memoryUpload = multer({
  storage: multer.memoryStorage(), // ❗ التخزين في الذاكرة فقط
  limits: {
    fileSize: 5 * 1024 * 1024, // ⛔ حد أقصى 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only JPEG, PNG, and WEBP are allowed."));
    }
  },
});