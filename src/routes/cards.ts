import express from 'express';
import { CardsController } from '../controllers/CardsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);
router.get('/', CardsController.getCards);
router.post('/', CardsController.createCard);
router.put('/:id', CardsController.updateCard);
router.delete('/:id', CardsController.deleteCard);
router.post('/:id/like', CardsController.toggleLikeCard);
router.post('/:id/favorite', CardsController.toggleFavoriteCard);

export default router;
