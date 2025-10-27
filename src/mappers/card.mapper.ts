import { Types } from 'mongoose';
import { CardDto, PopulatedCardDto } from '../dtos/card.dto';
import { ICard, IPopulatedCard } from '../models/Card';
import { CommentMapper } from './comment.mapper';

type OwnerParams = {
  _id: Types.ObjectId;
  username?: string;
  profilePicture?: string;
};

type OwnerResult = {
  ownerId: string;
  ownerUsername?: string;
  profilePicture?: string;
};

function isPopulatedOwner(
  owner: Types.ObjectId | OwnerParams
): owner is OwnerParams {
  return typeof owner === 'object' && '_id' in owner;
}

export class CardMapper {
  static extractOwnerData(owner: Types.ObjectId | OwnerParams): OwnerResult {
    let ownerId = '';
    let ownerUsername: string | undefined;
    let profilePicture: string | undefined;

    if (owner) {
      if (isPopulatedOwner(owner)) {
        ownerId = owner._id.toString();
        ownerUsername = owner.username;
        profilePicture = owner.profilePicture;
      } else {
        ownerId = owner.toString();
      }
    }

    return { ownerId, ownerUsername, profilePicture };
  }

  static toDto(card: ICard): CardDto {
    const { ownerId, ownerUsername, profilePicture } = this.extractOwnerData(
      card.owner
    );

    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl,
      visibility: card.visibility,
      author: {
        id: ownerId,
        username: ownerUsername,
        profilePicture,
      },
      likes: card.likes?.map((id: Types.ObjectId) => id.toString()) ?? [],
      favorites:
        card.favorites?.map((id: Types.ObjectId) => id.toString()) ?? [],
      comments: card.comments?.map((id: Types.ObjectId) => id.toString()) ?? [],
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  }

  static toDtoArray(cards: ICard[]): CardDto[] {
    return cards.map((card) => this.toDto(card));
  }

  static toPopulatedDto(card: IPopulatedCard): PopulatedCardDto {
    const { ownerId, ownerUsername, profilePicture } = this.extractOwnerData(
      card.owner
    );

    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl,
      visibility: card.visibility,
      author: {
        id: ownerId,
        username: ownerUsername,
        profilePicture,
      },
      likes: card.likes?.map((id: Types.ObjectId) => id.toString()) ?? [],
      favorites:
        card.favorites?.map((id: Types.ObjectId) => id.toString()) ?? [],
      comments: CommentMapper.toDtoArray(card.comments),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  }

  static toPopulatedDtoArray(cards: IPopulatedCard[]): PopulatedCardDto[] {
    return cards.map((card) => this.toPopulatedDto(card));
  }
}
