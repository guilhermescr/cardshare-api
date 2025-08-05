import { Types } from 'mongoose';
import { CardDto } from '../dtos/card.dto';
import { ICard } from '../models/Card';

function isPopulatedOwner(
  owner: Types.ObjectId | { _id: Types.ObjectId; username?: string }
): owner is { _id: Types.ObjectId; username?: string } {
  return typeof owner === 'object' && '_id' in owner;
}

export class CardMapper {
  static toDto(card: ICard): CardDto {
    let ownerId = '';
    let ownerUsername: string | undefined = undefined;

    if (card.owner) {
      if (isPopulatedOwner(card.owner)) {
        ownerId = card.owner._id.toString();
        ownerUsername = card.owner.username;
      } else {
        ownerId = card.owner.toString();
      }
    }

    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl,
      isPublic: card.isPublic,
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
