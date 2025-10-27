import { Types } from 'mongoose';
import { CommentDto } from '../dtos/comment.dto';
import { IComment } from '../models/Comment';

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
    cardId: comment.card.toString(),
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

export class CommentMapper {
  static toDto(comment: IComment): CommentDto {
    return extractCommentData(comment);
  }

  static toDtoArray(comments: IComment[]): CommentDto[] {
    return comments.map((comment) => extractCommentData(comment));
  }
}
