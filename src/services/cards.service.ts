import mongoose, { RootFilterQuery, Types } from 'mongoose';
import { CardDto, CreateCardDto, UpdateCardDto } from '../dtos/card.dto';
import { CardVisibilityEnum, ICard } from '../models/Card';
import { CardMapper } from '../mappers/card.mapper';
import { PaginatedResponseDto } from '../dtos/paginatedResponse.dto';
import { User } from '../models/User';
import { CardRepository } from '../repositories/card.repository';

export class CardsService {
  private cardRepository = new CardRepository();

  async getCardsCursor(
    authenticatedUserId: string,
    limit: number,
    cursor?: string,
    search?: string
  ): Promise<PaginatedResponseDto<CardDto>> {
    const query: RootFilterQuery<ICard> = {
      $or: [
        { visibility: CardVisibilityEnum.public },
        { owner: authenticatedUserId },
      ],
    };

    if (cursor) {
      query._id = { $gt: new Types.ObjectId(cursor) };
    }

    if (search) {
      const users = await User.find({
        username: { $regex: search, $options: 'i' },
      }).select('_id');
      const ownerIds = users.map((user) => user._id);

      query.$and = [
        {
          $or: [
            {
              title: { $regex: search, $options: 'i' },
            },
            {
              description: { $regex: search, $options: 'i' },
            },
            ...(ownerIds.length > 0 ? [{ owner: { $in: ownerIds } }] : []),
          ],
        },
      ];
    }

    const cards: ICard[] = await this.cardRepository.find(query, {
      sort: { _id: 1 },
      limit: limit + 1,
    });

    const items = CardMapper.toDtoArray(cards.slice(0, limit));
    const hasNext = cards.length > limit;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;

    return {
      items,
      nextCursor,
    };
  }

  async findCardById(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const query = {
      _id: cardId,
      $or: [
        { visibility: CardVisibilityEnum.public },
        { owner: authenticatedUserId },
        { visibility: CardVisibilityEnum.unlisted },
      ],
    };
    const card = await this.cardRepository.findOne(query);

    return card ? CardMapper.toDto(card) : null;
  }

  async createCard(
    authenticatedUserId: string,
    createCardDto: CreateCardDto
  ): Promise<CardDto | null> {
    const card = await this.cardRepository.create({
      ...createCardDto,
      owner: new Types.ObjectId(authenticatedUserId),
    });

    return card ? CardMapper.toDto(card) : null;
  }

  async updateCard(
    authenticatedUserId: string,
    cardId: string,
    updateCardDto: UpdateCardDto
  ): Promise<CardDto | null> {
    const query = {
      _id: cardId,
      owner: authenticatedUserId,
    };
    const card = await this.cardRepository.findOneAndUpdate(
      query,
      updateCardDto
    );

    return card ? CardMapper.toDto(card) : null;
  }

  async deleteCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const query = {
      _id: cardId,
      owner: authenticatedUserId,
    };
    const result = await this.cardRepository.findOneAndDelete(query);

    return result ? CardMapper.toDto(result) : null;
  }

  async toggleLikeCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const card = await this.cardRepository.findById(cardId);
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

    const updatedCard = await this.cardRepository.update(cardId, updateDto);
    return updatedCard ? CardMapper.toDto(updatedCard) : null;
  }

  async toggleFavoriteCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const card = await this.cardRepository.findById(cardId);
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

    const updatedCard = await this.cardRepository.update(cardId, updateDto);
    return updatedCard ? CardMapper.toDto(updatedCard) : null;
  }
}
