# CardShare API

<img src="cardshare-homepage.png" alt="CardShare Logo" style="display: block; margin-inline: auto;" />

## Introduction

The CardShare API is the backend service for the CardShare platform, designed to facilitate seamless sharing and management of digital cards. It provides robust features such as user authentication, card management, real-time notifications, AI-powered card generation, and efficient error handling, ensuring a smooth user experience.

## Features

- **Authentication**: Secure user authentication and authorization using JWT.
- **Card Management**: Create, update, delete, and retrieve digital cards.
- **AI-Powered Card Generation**: Automatically generate creative card ideas using the Gemini AI model.
- **Real-Time Notifications**: Stay updated with real-time notifications powered by Socket.IO.
- **Error Handling**: Centralized error handling for consistent and informative error responses.
- **File Uploads**: Upload and manage files using Multer and Cloudinary.
- **Swagger Documentation**: Comprehensive API documentation for easy integration.

## Technology Stack

- **Node.js**
- **Express**
- **TypeScript**
- **Mongoose**: ODM for MongoDB, enabling schema-based data modeling.
- **Socket.IO**: Real-time, bidirectional communication between clients and servers.
- **Multer**: Middleware for handling file uploads.
- **Swagger**: API documentation and testing tool.
- **Gemini AI**: AI model for generating creative card content.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/guilhermescr/cardshare-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cardshare-api
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Configure the environment variables:
   - Refer to the `.env.example` file for the necessary environment variables.
   - Create a `.env` file in the root directory and populate it with the required values.
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /auth/login**: Authenticate a user.
- **POST /auth/register**: Register a new user.

### User Management

- **GET /users/:id**: Retrieve user details.
- **PUT /users/:id**: Update user information.
- **DELETE /users/:id**: Delete a user.

### Card Operations

- **GET /cards**: Retrieve all cards.
- **POST /cards**: Create a new card.
- **POST /cards/generate**: Generate a creative card using AI.
- **GET /cards/:id**: Retrieve a specific card.
- **PUT /cards/:id**: Update a card.
- **DELETE /cards/:id**: Delete a card.

### Comments

- **POST /comments**: Add a comment to a card.
- **DELETE /comments/:id**: Delete a comment.

### Notifications

- **GET /notifications**: Retrieve all notifications.

### File Uploads

- **POST /upload**: Upload a file.

## Development

### Available Scripts

- **`npm run dev`**: Start the development server with hot-reloading.
- **`npm run build`**: Build the project for production.
- **`npm start`**: Start the production server.
- **`npm run tsoa`**: Generate Swagger documentation.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## Reporting Issues

If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/guilhermescr/cardshare-api/issues) or contact the author directly.

## Author

**Guilherme Rocha**  
[GitHub Profile](https://github.com/guilhermescr)
