import { Request, Response } from 'express';
import { Card } from '../model/card';

class CardsController {
  static async createCard(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      const card = new Card({ title, description });
      await card.save();
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create card' });
    }
  }

  static async getCards(req: Request, res: Response) {
    try {
      const cards = await Card.find();
      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve cards' });
    }
  }
}

module.exports = { CardsController };
