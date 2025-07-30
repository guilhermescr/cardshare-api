# Cards API

A simple RESTful API for managing cards, built with Node.js, Express, and MongoDB.

## Features

- Create new cards
- Retrieve all cards

## Getting Started

### Prerequisites

- Node.js
- MongoDB (running locally or accessible remotely)

### Installation

```bash
git clone https://github.com/yourusername/cards-api.git
cd cards-api
npm install
```

### Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

## API Endpoints

### Create a Card

- **POST** `/cards`
- **Body:**
  ```json
  {
    "title": "Card Title",
    "description": "Card Description"
  }
  ```

### Get All Cards

- **GET** `/cards`

## License

MIT
