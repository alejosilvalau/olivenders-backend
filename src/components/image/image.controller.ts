import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

async function signUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const milliseconds = 1000;
    const timestamp = Math.round(new Date().getTime() / milliseconds);
    const paramsToSign = {
      timestamp: timestamp,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);
    res.status(200).json({ message: 'Upload correctly signed', data: { timestamp, signature } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { signUpload };
