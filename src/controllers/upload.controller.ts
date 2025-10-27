import { Request as ExpressRequest } from 'express';
import {
  Post,
  SuccessResponse,
  Tags,
  Controller,
  Request,
  Route,
  Security,
} from 'tsoa';
import { UploadService } from '../services/upload.service';
import { AuthenticatedRequest } from '../types/auth';

@Route('upload')
@Tags('Upload')
@Security('jwt')
export class UploadController extends Controller {
  private uploadService = new UploadService();

  @Post('/profile-picture')
  @SuccessResponse(200, 'Profile picture uploaded successfully')
  public async uploadProfilePicture(
    @Request() req: ExpressRequest
  ): Promise<{ url: string }> {
    const file = req.file;

    if (!file) {
      throw { status: 400, message: 'No file uploaded' };
    }

    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;

    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const result = await this.uploadService.uploadProfilePicture(
      file,
      authenticatedUserId
    );
    return { url: result.secure_url };
  }
}
