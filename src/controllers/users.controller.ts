import {
  Route,
  Get,
  Post,
  Path,
  Request,
  Response,
  Tags,
  Security,
  Controller,
} from 'tsoa';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../types/auth';
import { Request as ExpressRequest } from 'express';

@Route('users')
@Tags('Users')
@Security('jwt')
export class UsersController extends Controller {
  private usersService = new UsersService();

  @Get('{id}')
  @Response(401, 'User not authenticated')
  @Response(404, 'User not found')
  public async getUserById(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ user: any }> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };
    const user = await this.usersService.getUserById(authenticatedUserId, id);
    if (!user) throw { status: 404, message: 'User not found.' };
    return { user };
  }

  @Post('{id}/follow')
  @Response(401, 'User not authenticated')
  public async toggleFollowUser(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ following: boolean }> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };
    const isFollowing = await this.usersService.toggleFollowUser(
      authenticatedUserId,
      id
    );
    return { following: isFollowing };
  }
}
