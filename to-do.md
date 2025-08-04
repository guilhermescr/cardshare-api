# TODO

## Features to Implement

### 1. Register Confirmation via E-mail

- [x] Complete e-mail confirmation flow for new users (send confirmation e-mail, store token, confirm via route, restrict login until confirmed).

---

### 2. Cards Feature

#### Card Model

- [x] Design Card schema (Mongoose) with:
  - `title` (string, required)
  - `description` (string)
  - `isPublic` (boolean, default: false)
  - `owner` (ObjectId, ref: User, required)
  - `createdAt` (Date, default: now)
  - `updatedAt` (Date, auto-update)
  - (Add more fields if needed, e.g. tags, images)

#### Card Operations

- [ ] Authenticated users can create, view, update, and delete their own cards.
- [x] Each card can be public or private (`isPublic`).
- [x] Private cards: Only owner can access (CRUD).
- [ ] Public cards: Visible to all users in feed and user profiles.

#### API Endpoints

- [x] `POST /cards` - Create a card (owner set from JWT).
- [x] `GET /cards` - List all cards owned by authenticated user.
- [x] `GET /cards/:id` - Get card by ID (owner or public).
- [x] `PUT /cards/:id` - Update card by ID (owner only).
- [x] `DELETE /cards/:id` - Delete card by ID (owner only).
- [x] `GET /feed` - List all public cards from all users.
- [ ] `GET /users/:id/cards` - List public cards for a specific user.

#### Access Control

- [x] Middleware to enforce JWT authentication for protected routes.
- [ ] Middleware to check card ownership for update/delete.
- [ ] Middleware to allow public card viewing for feed/profile.

---

**Notes:**

- Use JWT for authentication and authorization.
- Use nodemailer for e-mail features.
- Update API documentation after each feature.
