import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // ✅ بعد ما نزلناه

export const uploadImageToCloudinary = async (file: Express.Multer.File, folderPath: string) => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) {
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
