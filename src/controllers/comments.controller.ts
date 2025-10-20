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
} from 'tsoa';
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
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      throw { status: 401, message: 'User not authenticated.' };
    }

    const updatedComment = await this.commentsService.toggleLikeComment(
      id,
      authenticatedUserId
    );

    if (!updatedComment) {
      throw { status: 404, message: 'Comment not found.' };
    }

    return updatedComment;
  }
}
