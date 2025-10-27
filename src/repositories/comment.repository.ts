import { Comment, IComment } from '../models/Comment';

export class CommentRepository {
  async create(data: Partial<IComment>): Promise<IComment> {
    const comment = new Comment(data);
    await comment.save();
    await comment.populate('author', 'username profilePicture');
    return comment;
  }

  async findById(commentId: string): Promise<IComment | null> {
    return Comment.findById(commentId).exec();
  }

  async update(
    commentId: string,
    data: Partial<IComment>
  ): Promise<IComment | null> {
    return Comment.findByIdAndUpdate(commentId, data, { new: true }).exec();
  }

  async delete(commentId: string): Promise<IComment | null> {
    return Comment.findByIdAndDelete(commentId).exec();
  }

  async findOneAndDelete(query: any): Promise<IComment | null> {
    return Comment.findOneAndDelete(query).exec();
  }
}
