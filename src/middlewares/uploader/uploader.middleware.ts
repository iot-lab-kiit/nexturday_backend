import multer from 'multer';
import { FILE_SIZE } from '../../common/constants';

export class UploaderMiddleware {
  public uploader: multer.Multer;

  constructor() {
    const storage = multer.memoryStorage();
    this.uploader = multer({ storage, limits: { fileSize: FILE_SIZE } });
  }
}
