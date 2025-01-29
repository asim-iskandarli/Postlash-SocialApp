import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<any> => {
  return await cloudinary.uploader.upload(
    `data:image/png;base64,${buffer.toString("base64")}`,
    {
      upload_preset: "postlash",
      folder,
    }
  );
};

// Multer konfiqurasiyası (fayllar yaddaşa yüklənir)
