import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface IStorageService {
  upload(file: File, folder: string): Promise<string>;
  delete(url: string): Promise<void>;
}

export class CloudinaryStorageService implements IStorageService {
  /**
   * Upload a file to Cloudinary
   * @param file File to upload
   * @param folder Folder to upload to
   * @returns Promise<string> Cloudinary URL of the uploaded file
   */
  async upload(file: File, folder: string): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Cloudinary upload result is undefined"));
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Delete a file from Cloudinary
   * @param url Cloudinary URL of the file to delete
   * @returns Promise<void>
   */
  async delete(url: string): Promise<void> {
    try {
      const splitUrl = url.split("cloudinary.com/");
      if (splitUrl.length < 2) return;

      const path = splitUrl[1];
      if (!path) return;

      const pathParts = path.split("/");

      const uploadIndex = pathParts.indexOf("upload");
      if (uploadIndex === -1) return;

      let publicIdParts = pathParts.slice(uploadIndex + 1);

      const firstPart = publicIdParts[0];

      if (
        firstPart &&
        firstPart.startsWith("v") &&
        /^\d+$/.test(firstPart.substring(1))
      ) {
        publicIdParts = publicIdParts.slice(1);
      }

      if (publicIdParts.length === 0) return;

      const lastPart = publicIdParts[publicIdParts.length - 1];
      if (!lastPart) return;

      const lastPartSplit = lastPart.split(".");
      if (lastPartSplit.length > 1) {
        publicIdParts[publicIdParts.length - 1] = lastPartSplit
          .slice(0, -1)
          .join(".");
      }

      const finalPublicId = publicIdParts.join("/");

      if (finalPublicId) {
        await cloudinary.uploader.destroy(finalPublicId);
      }
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
    }
  }
}

export const storageService = new CloudinaryStorageService();
