import { Card, ICard } from '../models/Card';

export class CardRepository {
  async findById(cardId: string): Promise<ICard | null> {
    return Card.findById(cardId).populate('owner', 'username');
  }

  async findOne(query: any): Promise<ICard | null> {
    return Card.findOne(query).populate('owner', 'username');
  }

  async find(
    query: any,
    options: { sort?: any; limit?: number } = {}
  ): Promise<ICard[]> {
    let cursor = Card.find(query).populate('owner', 'username');
    if (options.sort) cursor = cursor.sort(options.sort);
    if (options.limit) cursor = cursor.limit(options.limit);
    return cursor;
  }

  async create(data: Partial<ICard>): Promise<ICard> {
    const card = new Card(data);
    return card.save();
  }

  async update(
    cardId: string,
    data: Record<string, any>
  ): Promise<ICard | null> {
    return Card.findByIdAndUpdate(cardId, data, { new: true });
  }

  async findOneAndUpdate(
    query: any,
    data: Partial<ICard>
  ): Promise<ICard | null> {
    return Card.findOneAndUpdate(query, data, { new: true });
  }

  async findOneAndDelete(query: any): Promise<ICard | null> {
    return Card.findOneAndDelete(query);
  }
}
