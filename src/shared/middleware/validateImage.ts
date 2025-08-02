import { check } from "express-validator";

export const validateImage = (fieldName = "image_url", isRequired = true) => [
  check(fieldName).custom((value, { req }) => {
    const file = req.file;

    if (!file && isRequired) {
      throw new Error("Image is required..");
    }

    //  PUT لو مش مطلوب شبه
    //  بس فيه صورة مرفوعة نعمل فاليديشن عادي
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(
          `Invalid file type: ${file.mimetype}. Only JPEG, PNG, WEBP are allowed.`
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large. Max size is 5MB.");
      }
    }

    return true;
  }),
];