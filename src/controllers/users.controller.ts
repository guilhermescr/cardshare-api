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
  Query,
} from 'tsoa';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../types/auth';
import { Request as ExpressRequest } from 'express';
import { CardsService } from '../services/cards.service';
import { PaginatedResponseDto } from '../dtos/paginatedResponse.dto';
import { CardDto } from '../dtos/card.dto';

@Route('users')
@Tags('Users')
@Security('jwt')
export class UsersController extends Controller {
  private usersService = new UsersService();
  private cardsService = new CardsService();

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
    const targetId = id === 'me' ? authenticatedUserId : id;
    const user = await this.usersService.getUserById(
      authenticatedUserId,
      targetId
    );
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

  @Get('me/cards')
  public async getMyCards(
    @Request() req: ExpressRequest,
    @Query() limit?: number,
    @Query() cursor?: string,
    @Query() sortBy?: 'latest' | 'most-liked'
  ): Promise<PaginatedResponseDto<CardDto>> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    return await this.cardsService.getMyCardsCursor(
      authenticatedUserId,
      limit ?? 9,
      cursor,
      sortBy
    );
  }

  @Get('me/liked')
  public async getMyLikedCards(
    @Request() req: ExpressRequest,
    @Query() limit?: number,
    @Query() cursor?: string,
    @Query() sortBy?: 'latest' | 'most-liked'
  ): Promise<PaginatedResponseDto<CardDto>> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    return await this.cardsService.getLikedCardsCursor(
      authenticatedUserId,
      limit ?? 9,
      cursor,
      sortBy
    );
  }
}
