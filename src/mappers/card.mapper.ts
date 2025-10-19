import { Types } from 'mongoose';
import { CardDto } from '../dtos/card.dto';
import { ICard } from '../models/Card';

function isPopulatedOwner(
  owner: Types.ObjectId | { _id: Types.ObjectId; username?: string }
): owner is { _id: Types.ObjectId; username?: string } {
  return typeof owner === 'object' && '_id' in owner;
}

export class CardMapper {
  static extractOwnerData(
    owner: Types.ObjectId | { _id: Types.ObjectId; username?: string }
  ): { ownerId: string; ownerUsername?: string } {
    let ownerId = '';
    let ownerUsername: string | undefined;

    if (owner) {
      if (isPopulatedOwner(owner)) {
        ownerId = owner._id.toString();
        ownerUsername = owner.username;
      } else {
        ownerId = owner.toString();
      }
    }

    return { ownerId, ownerUsername };
  }

  static toDto(card: ICard): CardDto {
    const { ownerId, ownerUsername } = this.extractOwnerData(card.owner);

    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl,
      visibility: card.visibility,
      owner: ownerId,
      ownerUsername,
      likes: card.likes?.map((id: Types.ObjectId) => id.toString()) ?? [],
      favorites:
        card.favorites?.map((id: Types.ObjectId) => id.toString()) ?? [],
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  }

  static toDtoArray(cards: ICard[]): CardDto[] {
    return cards.map((card) => this.toDto(card));
  }
}
