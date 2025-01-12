import multer from 'multer';

export class UploaderMiddleware {
  public uploader: multer.Multer;

  constructor() {
    const storage = multer.memoryStorage();
    this.uploader = multer({ storage });
  }
}
