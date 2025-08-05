# TODO

## Features to Implement

### Core Features

- [x] User registration and e-mail confirmation
- [x] JWT authentication and authorization
- [x] Card CRUD (Create, Read, Update, Delete)
- [x] Public/private cards
- [x] API endpoints for cards and users

---

### Feature Ideas

#### 1. Likes & Favorites

- [ ] Users can like or favorite cards
- [ ] Track number of likes per card
- [ ] Endpoint: `POST /cards/:id/like`

#### 2. Tags & Categories

- [ ] Add tags or categories to cards
- [ ] Filter/search cards by tag/category
- [ ] Endpoint: `GET /cards?tag=magic`

#### 3. Comments

- [ ] Users can comment on public cards
- [ ] Endpoint: `POST /cards/:id/comments`

#### 4. Card Sharing

- [ ] Generate shareable links for public cards
- [ ] Endpoint: `GET /cards/:id/share`

#### 5. User Profiles

- [ ] Add profile info (bio, avatar) to users
- [ ] Endpoint: `PUT /users/:id/profile`

#### 6. Card Search & Filter

- [ ] Search cards by title, description, tags, or owner
- [ ] Endpoint: `GET /cards?search=dragon`

#### 7. Pagination & Sorting

- [ ] Paginate card lists
- [ ] Sort cards by date, likes, etc.
- [ ] Endpoint: `GET /cards?page=2&sort=likes`

#### 8. Card History & Audit

- [ ] Track changes to cards (edit history)
- [ ] Endpoint: `GET /cards/:id/history`

#### 9. Admin Features

- [ ] Admin-only endpoints for managing users and cards
- [ ] Endpoint: `DELETE /users/:id` (admin only)

#### 10. Notifications

- [ ] Notify users when their cards are liked or commented on

---

**Notes:**

- Update API documentation after each feature.
- Use nodemailer for e-mail features.
