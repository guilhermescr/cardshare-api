import { Request } from 'express';
import { AuthPayloadDto } from '../dtos/auth.dto';

export interface AuthenticatedRequest extends Request {
  user?: AuthPayloadDto;
}
