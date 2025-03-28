import { IFile, IImageData } from '../../interfaces';
import { CloudinaryService } from '../../libs/cloudinary/cloudinary.service';


export class UploaderService {
  private s3BucketService: CloudinaryService;

  constructor() {
    this.s3BucketService = new CloudinaryService();
  }

  async uploadSingle(file: Express.Multer.File): Promise<IImageData> {
    return await this.s3BucketService.uploadSingle({
      buffer: file.buffer,
      contentType: file.mimetype,
    });
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<IImageData[]> {
    const filesData: IFile[] = files.map((file) => ({
      buffer: file.buffer,
      contentType: file.mimetype,
    }));

    return await this.s3BucketService.uploadMultiple(filesData);
  }

  async deleteSingle(key: string): Promise<void> {
    return await this.s3BucketService.deleteSingle(key);
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    return await this.s3BucketService.deleteMultiple(keys);
  }
}
