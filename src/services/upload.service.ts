import { Express } from 'express';
import cloudinary from '../config/cloudinary.config';
import { UserRepository } from '../repositories/user.repository';

export class UploadService {
  private userRepository = new UserRepository();

  async uploadFiles(
    files: Express.Multer.File[],
    cardId: string
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const fileExtension = file.originalname.split('.').pop();
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `card-media/${cardId}`,
            resource_type: fileExtension === 'mp4' ? 'video' : 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            } else {
              reject({ status: 500, message: 'Upload result is undefined.' });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }

  async deleteFiles(cardId: string): Promise<void> {
    const folderPrefix = `card-media/${cardId}/`;

    return new Promise((resolve, reject) => {
      cloudinary.api.delete_resources_by_prefix(
        folderPrefix,
        (error: Error) => {
          if (error) {
            reject(error);
          } else {
            cloudinary.api.delete_folder(
              folderPrefix,
              (folderError: Error | null, folderResult: any) => {
                if (folderError) {
                  reject(folderError);
                } else {
                  resolve(folderResult);
                }
              }
            );
          }
        }
      );
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async uploadProfilePicture(
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

  async removeProfilePicture(userId: string) {
    const publicId = `profile-pictures/${userId}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, async (error, result) => {
        if (error) {
          reject(error);
        } else {
          await this.userRepository.findByIdAndUpdate(userId, {
            profilePicture: null,
          });
          resolve(result);
        }
      });
    });
  }
}
