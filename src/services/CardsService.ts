import { CreateCardDto, UpdateCardDto } from '../dtos/card.dto';
import { Card } from '../models/Card';

export class CardsService {
  static async getCards(authenticatedUserId: string) {
    return Card.find({
      $or: [
        {
          isPublic: true,
        },
        {
          owner: authenticatedUserId,
        },
      ],
    }).populate('owner', 'username');
  }

  static async createCard(
    authenticatedUserId: string,
    createCardDto: CreateCardDto
  ) {
    const card = new Card({
      ...createCardDto,
      owner: authenticatedUserId,
    });
    return card.save();
  }

  static async updateCard(
    authenticatedUserId: string,
    cardId: string,
    updateCardDto: UpdateCardDto
  ) {
    const card = await Card.findOneAndUpdate(
      {
        _id: cardId,
        owner: authenticatedUserId,
      },
      updateCardDto,
      {
        new: true,
      }
    );
    return card;
  }

  static async deleteCard(authenticatedUserId: string, cardId: string) {
    const result = await Card.findOneAndDelete({
      _id: cardId,
      owner: authenticatedUserId,
    });
    return result;
  }
}
