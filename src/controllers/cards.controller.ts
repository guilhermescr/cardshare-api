import { NextFunction, Response } from 'express';
import { CardsService } from '../services/cards.service';
import { AuthenticatedRequest } from '../types/auth';
import { ClassValidator } from '../utils/ClassValidator';
import { CreateCardDto, UpdateCardDto } from '../dtos/card.dto';

export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  async getCards(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };

      const defaultLimit = 10;
      const limit = parseInt(req.query.limit as string) || defaultLimit;
      const cursor = req.query.cursor as string | undefined;
      const search = req.query.search
        ? (req.query.search as string).trim()
        : undefined;

      const response = await this.cardsService.getCardsCursor(
        authenticatedUserId,
        limit,
        cursor,
        search
      );
      return res.status(200).json({ ...response });
    } catch (error: any) {
      next(error);
    }
  }

  async getCardById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };

      const cardId = req.params.id;
      const card = await this.cardsService.findCardById(
        authenticatedUserId,
        cardId
      );
      if (!card) throw { status: 404, message: 'Card not found.' };

      return res.status(200).json({ card });
    } catch (error: any) {
      next(error);
    }
  }

  async createCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };

      const createCardDto = await ClassValidator.validate(
        CreateCardDto,
        req.body
      );
      const card = await this.cardsService.createCard(
        authenticatedUserId,
        createCardDto
      );
      return res.status(201).json({ card });
    } catch (error: any) {
      next(error);
    }
  }

  async updateCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };

      const cardId = req.params.id;
      const updateCardDto = await ClassValidator.validate(
        UpdateCardDto,
        req.body
      );
      const card = await this.cardsService.updateCard(
        authenticatedUserId,
        cardId,
        updateCardDto
      );
      if (!card) throw { status: 404, message: 'Card not found.' };
      return res.status(200).json({ card });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };

      const cardId = req.params.id;
      const deletedCard = await this.cardsService.deleteCard(
        authenticatedUserId,
        cardId
      );
      if (!deletedCard) throw { status: 404, message: 'Card not found.' };
      return res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  async toggleLikeCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authorized.' };

      const cardId = req.params.id;
      const card = await this.cardsService.toggleLikeCard(
        authenticatedUserId,
        cardId
      );
      return res.status(200).json({ card });
    } catch (error: any) {
      next(error);
    }
  }
  async toggleFavoriteCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authorized.' };

      const cardId = req.params.id;
      const card = await this.cardsService.toggleFavoriteCard(
        authenticatedUserId,
        cardId
      );
      return res.status(200).json({ card });
    } catch (error: any) {
      next(error);
    }
  }
}
