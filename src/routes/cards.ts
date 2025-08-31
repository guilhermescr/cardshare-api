import express from 'express';
import { CardsController } from '../controllers/cards.controller';
import { CardsService } from '../services/cards.service';
import { CardRepository } from '../repositories/card.repository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

const cardsService = new CardsService(new CardRepository());
const cardsController = new CardsController(cardsService);

router.use(authMiddleware);
router.get('/', cardsController.getCards.bind(cardsController));
router.get('/:id', cardsController.getCardById.bind(cardsController));
router.post('/', cardsController.createCard.bind(cardsController));
router.put('/:id', cardsController.updateCard.bind(cardsController));
router.delete('/:id', cardsController.deleteCard.bind(cardsController));
router.post('/:id/like', cardsController.toggleLikeCard.bind(cardsController));
router.post(
  '/:id/favorite',
  cardsController.toggleFavoriteCard.bind(cardsController)
);

export default router;
