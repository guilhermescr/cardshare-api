import { CommentRepository } from '../repositories/comment.repository';
import { CardRepository } from '../repositories/card.repository';
import { Types } from 'mongoose';
import { CommentMapper } from '../mappers/comment.mapper';
import { CommentDto } from '../dtos/comment.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from '../models/Notification';
import { NotificationEmitterService } from './notification-emitter.service';

export class CommentsService {
  private commentRepository = new CommentRepository();
  private cardRepository = new CardRepository();
  private notificationService = new NotificationService();
  private notificationEmitterService = new NotificationEmitterService();

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

    if (!comment) throw { status: 500, message: 'Failed to create comment.' };

    const mappedComment = CommentMapper.toPopulatedDto(comment);

    await this.cardRepository.update(cardId, {
      $push: { comments: comment._id },
    });

    if (mappedComment.card.owner) {
      await this.notificationService.createAndEmitNotification({
        type: NotificationType.Comment,
        message: `commented on your card: "${content}"`,
        sender: userId,
        recipient: mappedComment.card.owner,
        cardId: mappedComment.card.id,
        commentId: mappedComment.id,
        read: false,
      });
    }

    return mappedComment;
  }

  async deleteComment(
    authenticatedUserId: string,
    commentId: string
  ): Promise<CommentDto> {
    const query = {
      _id: commentId,
      author: new Types.ObjectId(authenticatedUserId),
    };
    const result = await this.commentRepository.findOneAndDelete(query);

    if (!result) throw { status: 404, message: 'Comment not found.' };

    const mappedComment = CommentMapper.toPopulatedDto(result);

    await this.cardRepository.update(mappedComment.card.id, {
      $pull: { comments: commentId },
    });

    if (mappedComment.card.owner) {
      const notification =
        await this.notificationService.deleteNotificationByTypeAndSender({
          type: [NotificationType.Comment, NotificationType.CommentLike],
          sender: authenticatedUserId,
          recipient: mappedComment.card.owner,
          cardId: mappedComment.card.id,
          commentId: commentId,
        });

      if (notification) {
        this.notificationEmitterService.emitNotificationRemoval(
          [notification.id],
          mappedComment.card.owner
        );
      }
    }

    return mappedComment;
  }

  async deleteCommentsByCardId(cardId: string): Promise<void> {
    await this.commentRepository.deleteMany({
      card: new Types.ObjectId(cardId),
    });
  }

  async toggleLikeComment(
    username: string,
    commentId: string,
    userId: string
  ): Promise<CommentDto> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) throw { status: 404, message: 'Comment not found.' };

    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = comment.likes.some((id) => id.equals(userObjectId));

    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => !id.equals(userObjectId));

      const notification =
        await this.notificationService.deleteNotificationByTypeAndSender({
          type: [NotificationType.CommentLike],
          sender: userId,
          recipient: comment.author.toString(),
          cardId: comment.card.toString(),
          commentId: commentId,
        });

      if (notification) {
        this.notificationEmitterService.emitNotificationRemoval(
          [notification.id],
          comment.author.toString()
        );
      }
    } else {
      comment.likes.push(userObjectId);

      await this.notificationService.createAndEmitNotification({
        type: NotificationType.CommentLike,
        message: `liked your comment: "${comment.content}"`,
        sender: userId,
        recipient: comment.author.toString(),
        cardId: comment.card.toString(),
        commentId: commentId,
        read: false,
      });
    }

    await comment.save();
    return CommentMapper.toDto(comment);
  }
}
