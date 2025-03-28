import { v2 as cloudinary } from 'cloudinary';
import { IFile, IImageData } from '../../interfaces';
import { CustomError } from '../../utils';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  async uploadSingle(file: IFile): Promise<IImageData> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(new CustomError('upload failed', 500));
          }
          resolve({
            url: result.secure_url,
            key: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadMultiple(files: IFile[]): Promise<IImageData[]> {
    return await Promise.all(files.map((file) => this.uploadSingle(file)));
  }

  async deleteSingle(key: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(key);
    } catch (error) {
      throw new CustomError('delete failed', 500);
    }
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteSingle(key)));
  }
}