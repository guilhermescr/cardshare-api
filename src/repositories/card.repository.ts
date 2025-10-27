import { Card, ICard, IPopulatedCard } from '../models/Card';

export class CardRepository {
  async findById(cardId: string): Promise<ICard | null> {
    return Card.findById(cardId)
      .populate('owner', 'username profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      })
      .exec();
  }

  async findOne(query: any): Promise<IPopulatedCard | null> {
    return Card.findOne(query)
      .populate('owner', 'username profilePicture')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      })
      .exec() as Promise<IPopulatedCard | null>;
  }

  async find(
    query: any,
    options: { sort?: any; limit?: number } = {}
  ): Promise<ICard[]> {
    let cursor = Card.find(query).populate('owner', 'username profilePicture');
    if (options.sort) cursor = cursor.sort(options.sort);
    if (options.limit) cursor = cursor.limit(options.limit);
    return cursor.exec();
  }

  async aggregate(pipeline: any[]): Promise<ICard[]> {
    return Card.aggregate(pipeline);
  }

  async create(data: Partial<ICard>): Promise<ICard> {
    const card = new Card(data);
    return card.save();
  }

  async update(
    cardId: string,
    data: Record<string, any>
  ): Promise<ICard | null> {
    return Card.findByIdAndUpdate(cardId, data, { new: true }).exec();
  }

  async findOneAndUpdate(
    query: any,
    data: Partial<ICard>
  ): Promise<ICard | null> {
    return Card.findOneAndUpdate(query, data, { new: true }).exec();
  }

  async findOneAndDelete(query: any): Promise<ICard | null> {
    return Card.findOneAndDelete(query).exec();
  }
}
