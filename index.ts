const express = require('express');
const mongoose = require('mongoose');
const { CardsController } = require('./controllers/CardsController');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cardsdb');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB.');
});

app.post('/cards', CardsController.createCard);
app.get('/cards', CardsController.getCards);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
