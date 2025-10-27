import { RootFilterQuery, Types } from 'mongoose';
import {
  CardDto,
  CreateCardDto,
  PopulatedCardDto,
  UpdateCardDto,
} from '../dtos/card.dto';
import { CardVisibilityEnum, ICard } from '../models/Card';
import { CardMapper } from '../mappers/card.mapper';
import { PaginatedResponseDto } from '../dtos/paginatedResponse.dto';
import { User } from '../models/User';
import { CardRepository } from '../repositories/card.repository';

function paginateCards(cards: ICard[], limit: number) {
  const items = CardMapper.toDtoArray(cards.slice(0, limit));
  const hasNext = cards.length > limit;
  const nextCursor = hasNext ? items[items.length - 1].id : undefined;
  return { items, nextCursor };
}

export class CardsService {
  private cardRepository = new CardRepository();

  async getCardsCursor(
    authenticatedUserId: string,
    limit: number,
    cursor?: string,
    search?: string,
    sortBy?: 'latest' | 'most-liked'
  ): Promise<PaginatedResponseDto<CardDto>> {
    const query: RootFilterQuery<ICard> = {
      $or: [
        { visibility: CardVisibilityEnum.public },
        { owner: new Types.ObjectId(authenticatedUserId) },
      ],
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
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

    if (sortBy === 'most-liked') {
      const pipeline: any[] = [
        { $match: query },
        {
          $addFields: {
            likesCount: { $size: { $ifNull: ['$likes', []] } },
          },
        },
        { $match: { likesCount: { $gt: 0 } } },
        { $sort: { likesCount: -1, _id: -1 } },
        { $limit: limit + 1 },
      ];

      const cards: ICard[] = await this.cardRepository.aggregate(pipeline);
      return paginateCards(cards, limit);
    } else {
      const sort = { _id: -1 };
      const cards: ICard[] = await this.cardRepository.find(query, {
        sort,
        limit: limit + 1,
      });

      return paginateCards(cards, limit);
    }
  }

  async getMyCardsCursor(
    authenticatedUserId: string,
    limit: number,
    cursor?: string,
    sortBy?: 'latest' | 'most-liked'
  ): Promise<PaginatedResponseDto<CardDto>> {
    const query: RootFilterQuery<ICard> = {
      owner: new Types.ObjectId(authenticatedUserId),
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    if (sortBy === 'most-liked') {
      const pipeline: any[] = [
        { $match: query },
        {
          $addFields: {
            likesCount: { $size: { $ifNull: ['$likes', []] } },
          },
        },
        { $sort: { likesCount: -1, _id: -1 } },
        { $limit: limit + 1 },
      ];
      const cards: ICard[] = await this.cardRepository.aggregate(pipeline);
      return paginateCards(cards, limit);
    } else {
      const cards: ICard[] = await this.cardRepository.find(query, {
        sort: { _id: -1 },
        limit: limit + 1,
      });
      return paginateCards(cards, limit);
    }
  }

  async getLikedCardsCursor(
    authenticatedUserId: string,
    limit: number,
    cursor?: string,
    sortBy?: 'latest' | 'most-liked'
  ): Promise<PaginatedResponseDto<CardDto>> {
    const query: RootFilterQuery<ICard> = {
      likes: new Types.ObjectId(authenticatedUserId),
      visibility: CardVisibilityEnum.public,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    if (sortBy === 'most-liked') {
      const pipeline: any[] = [
        { $match: query },
        {
          $addFields: {
            likesCount: { $size: { $ifNull: ['$likes', []] } },
          },
        },
        { $sort: { likesCount: -1, _id: -1 } },
        { $limit: limit + 1 },
      ];
      const cards: ICard[] = await this.cardRepository.aggregate(pipeline);
      return paginateCards(cards, limit);
    } else {
      const cards: ICard[] = await this.cardRepository.find(query, {
        sort: { _id: -1 },
        limit: limit + 1,
      });
      return paginateCards(cards, limit);
    }
  }

  async getCardById(
    authenticatedUserId: string,
    cardId: string
  ): Promise<PopulatedCardDto | null> {
    const query = {
      _id: cardId,
      $or: [
        { visibility: CardVisibilityEnum.public },
        { owner: new Types.ObjectId(authenticatedUserId) },
        { visibility: CardVisibilityEnum.unlisted },
      ],
    };
    const card = await this.cardRepository.findOne(query);

    return card ? CardMapper.toPopulatedDto(card) : null;
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
      owner: new Types.ObjectId(authenticatedUserId),
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
      owner: new Types.ObjectId(authenticatedUserId),
    };
    const result = await this.cardRepository.findOneAndDelete(query);

    return result ? CardMapper.toDto(result) : null;
  }

  async toggleLikeCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const query = {
      _id: cardId,
      $or: [
        { visibility: CardVisibilityEnum.public },
        { owner: new Types.ObjectId(authenticatedUserId) },
        { visibility: CardVisibilityEnum.unlisted },
      ],
    };
    const card = await this.cardRepository.findOne(query);

    if (!card) throw { status: 404, message: 'Card not found.' };

    const userObjectId = new Types.ObjectId(authenticatedUserId);

    const hasLiked = card.likes.some((id: Types.ObjectId) =>
      id.equals(userObjectId)
    );

    let updateDto;
    if (hasLiked) {
      updateDto = { $pull: { likes: userObjectId } };
    } else {
      updateDto = { $addToSet: { likes: userObjectId } };
    }

    const updatedCard = await this.cardRepository.update(cardId, updateDto);

    if (!updatedCard) return null;

    const ownerData = CardMapper.extractOwnerData(card.owner);
    return {
      ...CardMapper.toDto(updatedCard),
      author: ownerData.ownerId,
      authorUsername: ownerData.ownerUsername,
    };
  }

  async toggleFavoriteCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<CardDto | null> {
    const query = {
      _id: cardId,
      $or: [
        { visibility: CardVisibilityEnum.public },
        { owner: new Types.ObjectId(authenticatedUserId) },
        { visibility: CardVisibilityEnum.unlisted },
      ],
    };
    const card = await this.cardRepository.findOne(query);

    if (!card) throw { status: 404, message: 'Card not found.' };

    const userObjectId = new Types.ObjectId(authenticatedUserId);

    const hasFavorited = card.favorites.some((id: Types.ObjectId) =>
      id.equals(userObjectId)
    );

    let updateDto;
    if (hasFavorited) {
      updateDto = { $pull: { favorites: userObjectId } };
    } else {
      updateDto = { $addToSet: { favorites: userObjectId } };
    }

    const updatedCard = await this.cardRepository.update(cardId, updateDto);

    if (!updatedCard) return null;

    const ownerData = CardMapper.extractOwnerData(card.owner);
    return {
      ...CardMapper.toDto(updatedCard),
      author: ownerData.ownerId,
      authorUsername: ownerData.ownerUsername,
    };
  }
}
