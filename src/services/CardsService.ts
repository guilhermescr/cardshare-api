import { CreateCardDto, UpdateCardDto } from '../dtos/card.dto';
import { Card } from '../models/Card';

export class CardsService {
  static async getCards(userId: string) {
    return Card.find({
      $or: [
        {
          isPublic: true,
        },
        {
          owner: userId,
        },
      ],
    }).populate('owner', 'username');
  }

  static async createCard(userId: string, createCardDto: CreateCardDto) {
    const card = new Card({
      ...createCardDto,
      owner: userId,
    });
    return card.save();
  }

  static async updateCard(
    userId: string,
    cardId: string,
    updateCardDto: UpdateCardDto
  ) {
    const card = await Card.findOneAndUpdate(
      {
        _id: cardId,
        owner: userId,
      },
      updateCardDto,
      {
        new: true,
      }
    );
    return card;
  }

  static async deleteCard(userId: string, cardId: string) {
    const result = await Card.findOneAndDelete({
      _id: cardId,
      owner: userId,
    });
    return result;
  }
}
