import { Types } from 'mongoose';
import { CommentDto } from '../dtos/comment.dto';
import { IComment, IPopulatedComment } from '../models/Comment';

function extractCommentData(comment: IComment): CommentDto {
  const authorId =
    typeof comment.author === 'object' && '_id' in comment.author
      ? comment.author._id.toString()
      : (comment.author as Types.ObjectId).toString();

  const author =
    typeof comment.author === 'object' && '_id' in comment.author
      ? (comment.author as { _id: Types.ObjectId; username?: string }).username
      : undefined;

  const profilePicture =
    typeof comment.author === 'object' && '_id' in comment.author
      ? (comment.author as { _id: Types.ObjectId; profilePicture?: string })
          .profilePicture
      : undefined;

  return {
    id: comment._id.toString(),
    card: {
      id: comment.card.toString(),
      owner: undefined,
    },
    author: {
      id: authorId,
      username: author,
      profilePicture: profilePicture,
    },
    content: comment.content,
    likes: comment.likes?.map((id: Types.ObjectId) => id.toString()) ?? [],
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

function extractPopulatedCommentData(comment: IPopulatedComment): CommentDto {
  const cardId =
    typeof comment.card === 'object' && '_id' in comment.card
      ? comment.card._id.toString()
      : (comment.card as Types.ObjectId).toString();

  const cardOwner =
    typeof comment.card === 'object' && 'owner' in comment.card
      ? comment.card.owner?.toString()
      : undefined;

  return {
    id: comment._id.toString(),
    card: {
      id: cardId,
      owner: cardOwner,
    },
    author: {
      id: comment.author._id.toString(),
      username: comment.author.username,
      profilePicture: comment.author.profilePicture,
    },
    content: comment.content,
    likes: comment.likes?.map((id: Types.ObjectId) => id.toString()) ?? [],
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

export class CommentMapper {
  static toDto(comment: IComment): CommentDto {
    return extractCommentData(comment);
  }

  static toPopulatedDto(comment: IPopulatedComment): CommentDto {
    return extractPopulatedCommentData(comment);
  }

  static toDtoArray(comments: IComment[]): CommentDto[] {
    return comments.map((comment) => extractCommentData(comment));
  }

  static toPopulatedDtoArray(comments: IPopulatedComment[]): CommentDto[] {
    return comments.map((comment) => extractPopulatedCommentData(comment));
  }
}
