# Simple CRM

A simple CRM project with an admin panel to view and manage user-submitted contact forms.

## Stack

- **Frontend:** React + TypeScript + CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB
- **Admin passwords:** hashed with bcrypt

## Features

- Admin panel:
  - View forms submitted by users
  - Delete submissions
  - Mark submissions as read
  - Sort forms by date (newest/oldest)
  - Search forms by email address
- User contact form
- Simple admin login system

## Installation

1. Clone the repository:
  ```bash
  git clone <repo-url>
  cd simple-crm
  ```

---

2. Install frontend and backend dependencies:
  ```bash
    npm install
  ```
---
3. Create a .env file in src/backend with your MongoDB connection:
  ```bash
    MONGO_URL=mongodb://127.0.0.1:27017/CRM-Database
  ```

---

4. Run the backend:
  ```bash
    npm run server
  ```

---

5. Run the frontend:
  ```bash
    npm start
  ```

---

## Usage
- Open http://localhost:5173 in your browser to see the frontend
- Log in as an admin to access the form management panel