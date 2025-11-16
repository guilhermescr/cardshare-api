import { Express } from 'express';
import { RootFilterQuery, Types } from 'mongoose';
import {
  CardDto,
  CreateCardDto,
  PopulatedCardDto,
  RelatedCardDto,
  UpdateCardDto,
} from '../dtos/card.dto';
import { CardVisibilityEnum, ICard } from '../models/Card';
import { CardMapper } from '../mappers/card.mapper';
import { PaginatedResponseDto } from '../dtos/paginatedResponse.dto';
import { User } from '../models/User';
import { CardRepository } from '../repositories/card.repository';
import { UploadService } from './upload.service';
import { CommentsService } from './comments.service';
import { NotificationType } from '../models/Notification';
import { NotificationService } from './notification.service';
import { AuthPayloadDto } from '../dtos/auth.dto';
import { NotificationEmitterService } from './notification-emitter.service';

function paginateCards(cards: ICard[], limit: number) {
  const items = CardMapper.toDtoArray(cards.slice(0, limit));
  const hasNext = cards.length > limit;
  const nextCursor = hasNext ? items[items.length - 1].id : undefined;
  return { items, nextCursor };
}

export class CardsService {
  private cardRepository = new CardRepository();
  private uploadService = new UploadService();
  private commentsService = new CommentsService();
  private notificationService = new NotificationService();
  private notificationEmitterService = new NotificationEmitterService();

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
    createCardDto: CreateCardDto,
    files?: Express.Multer.File[]
  ): Promise<CardDto | null> {
    const card = await this.cardRepository.create({
      ...createCardDto,
      owner: new Types.ObjectId(authenticatedUserId),
      mediaUrls: [],
    });

    if (!card) return null;

    let mediaUrls: string[] = [];
    if (files && files.length > 0) {
      mediaUrls = await this.uploadService.uploadFiles(
        files,
        card._id.toString()
      );
    }

    const updatedCard = await this.cardRepository.findOneAndUpdate(
      { _id: card._id },
      { mediaUrls }
    );

    return updatedCard ? CardMapper.toDto(updatedCard) : null;
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

    const card = await this.cardRepository.findOne(query);

    if (!card) return null;

    try {
      await this.uploadService.deleteFiles(cardId);
    } catch (error: any) {
      console.error(
        `Error deleting media files for card ${cardId}:`,
        error.message || error
      );
    }

    await this.commentsService.deleteCommentsByCardId(cardId);

    const result = await this.cardRepository.findOneAndDelete(query);

    return result ? CardMapper.toDto(result) : null;
  }

  async toggleLikeCard(
    authenticatedUser: AuthPayloadDto,
    cardId: string
  ): Promise<PopulatedCardDto> {
    const authenticatedUserId = authenticatedUser.id;

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

      const notification =
        await this.notificationService.deleteNotificationByTypeAndSender({
          type: [NotificationType.CardLike],
          sender: authenticatedUserId,
          recipient: card.owner._id.toString(),
          cardId: cardId,
        });

      if (notification) {
        this.notificationEmitterService.emitNotificationRemoval(
          notification.id,
          card.owner._id.toString()
        );
      }
    } else {
      updateDto = { $addToSet: { likes: userObjectId } };

      await this.notificationService.createAndEmitNotification({
        type: NotificationType.CardLike,
        message: `liked your card "${card.title}"`,
        sender: authenticatedUserId,
        recipient: card.owner._id.toString(),
        cardId: cardId,
        read: false,
      });
    }

    await this.cardRepository.update(cardId, updateDto);

    const updatedCard = await this.cardRepository.findByIdPopulated(cardId);

    if (!updatedCard) {
      throw { status: 500, message: 'Failed to update card.' };
    }

    const ownerData = CardMapper.extractOwnerData(card.owner);
    return {
      ...CardMapper.toPopulatedDto(updatedCard),
      author: {
        id: ownerData.ownerId,
        username: ownerData.ownerUsername,
        profilePicture: ownerData.profilePicture,
      },
    };
  }

  async toggleFavoriteCard(
    authenticatedUserId: string,
    cardId: string
  ): Promise<PopulatedCardDto> {
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

    await this.cardRepository.update(cardId, updateDto);

    const updatedCard = await this.cardRepository.findByIdPopulated(cardId);

    if (!updatedCard) throw { status: 500, message: 'Failed to update card.' };

    const ownerData = CardMapper.extractOwnerData(card.owner);
    return {
      ...CardMapper.toPopulatedDto(updatedCard),
      author: {
        id: ownerData.ownerId,
        username: ownerData.ownerUsername,
        profilePicture: ownerData.profilePicture,
      },
    };
  }

  async getRelatedCards(
    cardId: string,
    limit: number
  ): Promise<RelatedCardDto[]> {
    const card = await this.cardRepository.findById(cardId);

    if (!card) throw { status: 404, message: 'Card not found.' };

    const query = {
      _id: { $ne: cardId },
      visibility: CardVisibilityEnum.public,
      $or: [{ tags: { $in: card.tags } }, { category: card.category }],
    };

    const relatedCards = await this.cardRepository.find(query, {
      sort: { _id: -1 },
      limit,
    });

    return CardMapper.toRelatedCardDtoArray(relatedCards);
  }
}
