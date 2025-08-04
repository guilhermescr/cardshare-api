import { NextFunction, Response } from 'express';
import { CardsService } from '../services/CardsService';
import { AuthenticatedRequest } from '../types/auth';
import { ClassValidator } from '../utils/ClassValidator';
import { CreateCardDto, UpdateCardDto } from '../dtos/card.dto';

export class CardsController {
  static async getCards(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw { status: 401, message: 'User not authenticated.' };
      const cards = await CardsService.getCards(userId);
      return res.status(200).json({ cards });
    } catch (error: any) {
      next(error);
    }
  }

  static async createCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw { status: 401, message: 'User not authenticated.' };
      const createCardDto = await ClassValidator.validate(
        CreateCardDto,
        req.body
      );
      const card = await CardsService.createCard(userId, createCardDto);
      return res.status(201).json({ card });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw { status: 401, message: 'User not authenticated.' };
      const cardId = req.params.id;
      const updateCardDto = await ClassValidator.validate(
        UpdateCardDto,
        req.body
      );
      const card = await CardsService.updateCard(userId, cardId, updateCardDto);
      if (!card) throw { status: 404, message: 'Card not found.' };
      return res.status(200).json({ card });
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw { status: 401, message: 'User not authenticated.' };
      const cardId = req.params.id;
      const deletedCard = await CardsService.deleteCard(userId, cardId);
      if (!deletedCard) throw { status: 404, message: 'Card not found.' };
      return res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
}
