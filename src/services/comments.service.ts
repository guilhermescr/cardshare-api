import { CommentRepository } from '../repositories/comment.repository';
import { CardRepository } from '../repositories/card.repository';
import { Types } from 'mongoose';
import { CommentMapper } from '../mappers/comment.mapper';
import { CommentDto } from '../dtos/comment.dto';

export class CommentsService {
  private commentRepository = new CommentRepository();
  private cardRepository = new CardRepository();

  async addComment(
    cardId: string,
    userId: string,
    content: string
  ): Promise<CommentDto> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) throw { status: 404, message: 'Card not found.' };

    const comment = await this.commentRepository.create({
      content,
      author: new Types.ObjectId(userId),
      card: new Types.ObjectId(cardId),
    });

    await this.cardRepository.update(cardId, {
      $push: { comments: comment._id },
    });

    return CommentMapper.toDto(comment);
  }

  async toggleLikeComment(
    commentId: string,
    userId: string
  ): Promise<CommentDto> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw { status: 404, message: 'Comment not found.' };

    const userObjectId = new Types.ObjectId(userId);

    const hasLiked = comment.likes.some((id) => id.equals(userObjectId));

    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => !id.equals(userObjectId));
    } else {
      comment.likes.push(userObjectId);
    }

    await comment.save();
    return CommentMapper.toDto(comment);
  }
}
