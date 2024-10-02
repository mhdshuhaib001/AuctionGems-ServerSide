import { rejects } from "assert";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { ReadStream } from "fs";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Convert buffer to a readable stream
const bufferToStream = (buffer: Buffer): Readable => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

class CloudinaryHelper {

  // Upload single file using a file path
  uploadSingleFile(filePath: string, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        { folder: folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?.secure_url);
        }
      );
    });
  }

  // Upload using a file stream
  uploadStream(fileStream: ReadStream, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?.secure_url);
        }
      );
      fileStream.pipe(uploadStream);
    });
  }

  // Upload using a buffer (converted to stream)
  uploadBuffer(fileBuffer: Buffer, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?.secure_url);
        }
      );
      
      const stream = bufferToStream(fileBuffer); 
      stream.pipe(uploadStream);
    });
  }

  // Upload multiple files (useful for bulk uploads)
  uploadMultipleFiles(filePaths: string[], folder: string): Promise<any[]> {
    return Promise.all(filePaths.map(filePath => 
      this.uploadSingleFile(filePath, folder)
    ));
  }

  // Delete a file from Cloudinary
  deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  }
}

export default CloudinaryHelper;
