# TODO

## Features to Implement

### 1. Register Confirmation via E-mail

- [x] Send a confirmation e-mail after user registration.
- [x] Add a confirmation token to the user model.
- [x] Create a route to confirm registration using the token.
- [x] Prevent login for users who have not confirmed their e-mail.
- [ ] Add resend confirmation e-mail functionality.

### 2. Cards CRUD Routes

- [ ] Create a model for cards.
- [ ] Implement the following routes:
  - [ ] `POST /cards` - Create a new card (protected route).
  - [ ] `GET /cards` - List all cards for the authenticated user.
  - [ ] `GET /cards/:id` - Get a single card by ID.
  - [ ] `PUT /cards/:id` - Update a card by ID.
  - [ ] `DELETE /cards/:id` - Delete a card by ID.
- [x] Add authentication middleware to protect card routes.

---

**Notes:**

- Use JWT authentication for protected routes.
- Consider using a library like nodemailer for sending e-mails.
- Update documentation after implementing each feature.
