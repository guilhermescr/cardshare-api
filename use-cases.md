# 📘 Use Cases & Frontend Flow

## Overview

This document outlines the high-level user experience (UX) design and navigation flow of the card-sharing app. It maps out screens, user actions, and how different parts of the application connect, helping guide frontend development and interface decisions.

---

## 🧭 App Flow Summary

### 1. Authentication Flow

**Screens:**
- Login
- Register
- Confirm Email
- Forgot Password (optional)

**User Actions:**
- Register an account
- Confirm email via link
- Log in using email/username + password
- Log out
- Error handling (e.g., invalid credentials, unverified account)

**Flow:**
- Unauthenticated users start here
- After login, users are redirected to Dashboard/Home
- JWT is stored for authenticated API calls

---

### 2. Dashboard / Home Feed

**Purpose:**  
Show list of cards available to the user:
- Their own cards
- Public cards from others
- Cards filtered by search, tags, or categories

**User Actions:**
- View list/grid of cards
- Filter/search by:
  - Title
  - Description
  - Tag
  - Owner
- Like / favorite cards
- Comment (if public)
- Sort by likes, date, etc.
- Navigate to card details

---

### 3. Card Details View

**Purpose:**  
Display the full content of a selected card

**User Actions:**
- Like / favorite the card
- Leave a comment (if public)
- Share via link
- View tags and category
- View author and link to their profile
- (If owner) Edit or delete the card

---

### 4. Card Editor (Create/Edit)

**Purpose:**  
Allow users to create or edit a card

**Fields:**
- Title
- Description / content
- Tags and/or categories
- Visibility (public/private)
- Submit or cancel

**User Actions:**
- Save new card
- Update existing card
- Toggle between draft/public
- Delete card

---

### 5. User Profile

**Purpose:**  
Display a user’s personal information and authored cards

**User Actions:**
- View user bio, avatar
- See user’s cards
- Edit own profile (if owner)
- View cards the user has liked or favorited (optional)

---

### 6. Admin Panel

**Purpose:**  
Restricted to admins for platform management

**User Actions:**
- View list of all users
- Delete users (e.g., for abuse)
- View/manage reported cards or comments
- View admin-only stats (optional)

---

### 7. Notifications

**Purpose:**  
Show relevant activity related to the user’s content

**User Actions:**
- View notification list
  - Someone liked your card
  - Someone commented on your card
- Click to navigate to card or user
- (Optional) Mark as read or dismiss notifications

---

## 🔁 Interaction Flows

### A. Create & Share a Card
1. User logs in
2. Clicks "Create Card"
3. Fills out form and marks as public
4. Submits the card
5. Redirected to card view or dashboard
6. Copies public link and shares it

---

### B. Explore & Interact with Public Cards
1. User visits dashboard or uses search
2. Filters cards by tags or keywords
3. Opens a card
4. Likes/favorites it
5. Leaves a comment
6. Views author’s profile

---

### C. Edit Existing Card
1. User navigates to their card
2. Clicks “Edit”
3. Updates content, tags, or visibility
4. Saves changes
5. Card is updated and visible accordingly

---

### D. Admin Deletes User
1. Admin logs in
2. Opens admin panel
3. Locates user in list
4. Deletes user account
5. (Optional) All user’s cards are removed or flagged

---

## 🧠 UX Considerations

- Prevent access to private cards by other users
- Smooth transitions (consider modals vs full page views)
- Real-time feedback with toasts for actions (like, comment, save)
- Skeleton loaders during async operations
- Clear access control:
  - Unauthenticated users can view public cards
  - Only logged-in users can interact (like/comment/favorite)
- Token expiration handling (auto logout, refresh)