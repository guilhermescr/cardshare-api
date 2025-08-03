import express from 'express';
import { CardsController } from '../controllers/CardsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);
router.get('/', CardsController.getCards);

export default router;
