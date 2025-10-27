import { Express } from 'express';
import cloudinary from '../config/cloudinary.config';
import { UserRepository } from '../repositories/user.repository';

export class UploadService {
  private userRepository = new UserRepository();

  public async uploadProfilePicture(
    file: Express.Multer.File,
    userId: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const fileExtension = file.originalname.split('.').pop();
      const publicId = `profile-pictures/${userId}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-pictures',
          resource_type: 'image',
          overwrite: true,
          public_id: publicId,
          format: fileExtension,
        },
        async (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            await this.userRepository.findByIdAndUpdate(userId, {
              profilePicture: result.secure_url,
            });
            resolve(result);
          } else {
            reject({ status: 500, message: 'Upload result is undefined.' });
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
}
