import mongoose from 'mongoose';
import { CardDto, CreateCardDto, UpdateCardDto } from '../dtos/card.dto';
import { Card, ICard } from '../models/Card';
import { CardMapper } from '../mappers/CardMapper';

export class CardsService {
  static async getCards(
    authenticatedUserId: string
  ): Promise<CardDto[] | null> {
    const cards: ICard[] = await Card.find({
      $or: [
        {
          isPublic: true,
        },
        {
          owner: authenticatedUserId,
        },
      ],
    }).populate('owner', 'username');

    return CardMapper.toDtoArray(cards);
  }

  static async findCardById(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const card = await Card.findOne({
      $or: [
        {
          _id: cardId,
          isPublic: true,
        },
        {
          _id: cardId,
          owner: authenticatedUserId,
        },
      ],
    }).populate('owner', 'username');

    return card ? CardMapper.toDto(card) : null;
  }

  static async createCard(
    authenticatedUserId: string,
    createCardDto: CreateCardDto
  ): Promise<CardDto | null> {
    const card = new Card({
      ...createCardDto,
      owner: authenticatedUserId,
    });
    const savedCard: ICard = await card.save();

    return savedCard ? CardMapper.toDto(savedCard) : null;
  }

  static async updateCard(
    authenticatedUserId: string,
    cardId: string,
    updateCardDto: UpdateCardDto
  ): Promise<CardDto | null> {
    const card: ICard | null = await Card.findOneAndUpdate(
      {
        _id: cardId,
        owner: authenticatedUserId,
      },
      updateCardDto,
      {
        new: true,
      }
    );

    return card ? CardMapper.toDto(card) : null;
  }

  static async deleteCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const result: ICard | null = await Card.findOneAndDelete({
      _id: cardId,
      owner: authenticatedUserId,
    });

    return result ? CardMapper.toDto(result) : null;
  }

  static async toggleLikeCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const card: ICard | null = await Card.findById(cardId);
    if (!card) throw { status: 404, message: 'Card not found.' };

    const userObjectId = new mongoose.Types.ObjectId(authenticatedUserId);
    const hasLiked = card.likes.some((id: mongoose.Types.ObjectId) =>
      id.equals(userObjectId)
    );

    let updateDto;
    if (hasLiked) {
      updateDto = { $pull: { likes: userObjectId } };
    } else {
      updateDto = { $addToSet: { likes: userObjectId } };
    }

    const updatedCard: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      updateDto,
      {
        new: true,
      }
    );
    return updatedCard ? CardMapper.toDto(updatedCard) : null;
  }

  static async toggleFavoriteCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const card: ICard | null = await Card.findById(cardId);
    if (!card) throw { status: 404, message: 'Card not found.' };

    const userObjectId = new mongoose.Types.ObjectId(authenticatedUserId);
    const hasFavorited = card.favorites.some((id: mongoose.Types.ObjectId) =>
      id.equals(userObjectId)
    );

    let updateDto;
    if (hasFavorited) {
      updateDto = { $pull: { favorites: userObjectId } };
    } else {
      updateDto = { $addToSet: { favorites: userObjectId } };
    }

    const updatedCard: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      updateDto,
      {
        new: true,
      }
    );
    return updatedCard ? CardMapper.toDto(updatedCard) : null;
  }
}
