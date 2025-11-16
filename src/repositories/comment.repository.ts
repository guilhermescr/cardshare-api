import { Comment, IComment, IPopulatedComment } from '../models/Comment';

export class CommentRepository {
  async findById(commentId: string): Promise<IComment | null> {
    return Comment.findById(commentId).exec();
  }

  async findByIdPopulated(
    commentId: string
  ): Promise<IPopulatedComment | null> {
    return Comment.findById(commentId)
      .populate('author', 'username profilePicture')
      .populate('card', 'owner')
      .exec() as Promise<IPopulatedComment | null>;
  }

  async findOneAndDelete(query: any): Promise<IPopulatedComment | null> {
    return Comment.findOneAndDelete(query)
      .populate('author', 'username profilePicture')
      .populate('card', 'owner')
      .exec() as Promise<IPopulatedComment | null>;
  }

  async create(data: Partial<IComment>): Promise<IPopulatedComment> {
    const comment = new Comment(data);
    await comment.save();
    return this.findByIdPopulated(
      comment._id.toString()
    ) as Promise<IPopulatedComment>;
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

  async deleteMany(query: any): Promise<void> {
    await Comment.deleteMany(query).exec();
  }
}
