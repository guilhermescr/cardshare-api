import {
  Route,
  Post,
  Path,
  Body,
  Request,
  SuccessResponse,
  Response,
  Tags,
  Security,
  Controller,
  Delete,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { CommentsService } from '../services/comments.service';
import { AuthenticatedRequest } from '../types/auth';
import { CommentDto, CreateCommentDto } from '../dtos/comment.dto';

@Route('comments')
@Tags('Comments')
@Security('jwt')
export class CommentsController extends Controller {
  private commentsService = new CommentsService();

  @SuccessResponse(201, 'Comment created')
  @Post('/')
  public async createComment(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateCommentDto
  ): Promise<CommentDto> {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      throw { status: 401, message: 'User not authenticated.' };
    }

    const comment = await this.commentsService.addComment(
      body.cardId,
      authenticatedUserId,
      body.content
    );
    this.setStatus(201);
    return comment;
  }

  @Post('{id}/like')
  @Response(404, 'Comment not found')
  public async toggleLikeComment(
    @Request() req: AuthenticatedRequest,
    @Path() id: string
  ): Promise<CommentDto> {
    const authenticatedUser = (req as AuthenticatedRequest).user;

    if (!authenticatedUser) {
      throw { status: 401, message: 'User not authenticated.' };
    }

    const updatedComment = await this.commentsService.toggleLikeComment(
      authenticatedUser.username,
      id,
      authenticatedUser.id
    );

    if (!updatedComment) {
      throw { status: 404, message: 'Comment not found.' };
    }

    return updatedComment;
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Comment deleted')
  @Response(404, 'Comment not found')
  public async deleteComment(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    await this.commentsService.deleteComment(authenticatedUserId, id);

    this.setStatus(204);
  }
}
