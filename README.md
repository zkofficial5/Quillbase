# Quillbase

A RESTful blog API built with Laravel 11 and documented with a custom React explorer UI.

## Tech Stack

**Backend:** Laravel 11, MySQL, Laravel Sanctum (token auth)  
**Frontend:** React, TypeScript, Framer Motion, shadcn/ui, Tailwind CSS

## Features

- Token-based authentication (register, login, logout)
- Full CRUD for blog posts with tag support
- Nested comments on posts
- Live API explorer — try every endpoint directly in the browser
- Clean JSON error responses across all endpoints

## Project Structure

```
Quillbase/
├── backend/     # Laravel 11 REST API
└── frontend/    # React API explorer UI
```

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- MySQL
- Node.js 18+

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database called `quillbase`, update `.env` with your credentials, then:

```bash
php artisan migrate
php artisan serve
```

API runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Explorer runs on `http://localhost:8080`

## API Endpoints

### Auth

| Method | Endpoint                | Description         | Auth |
| ------ | ----------------------- | ------------------- | ---- |
| POST   | `/api/v1/auth/register` | Register new user   | No   |
| POST   | `/api/v1/auth/login`    | Login and get token | No   |
| GET    | `/api/v1/auth/me`       | Get current user    | Yes  |
| POST   | `/api/v1/auth/logout`   | Logout              | Yes  |

### Posts

| Method | Endpoint            | Description     | Auth |
| ------ | ------------------- | --------------- | ---- |
| GET    | `/api/v1/posts`     | List all posts  | No   |
| POST   | `/api/v1/posts`     | Create a post   | Yes  |
| GET    | `/api/v1/posts/:id` | Get single post | No   |
| PUT    | `/api/v1/posts/:id` | Update post     | Yes  |
| DELETE | `/api/v1/posts/:id` | Delete post     | Yes  |

### Comments

| Method | Endpoint                             | Description    | Auth |
| ------ | ------------------------------------ | -------------- | ---- |
| GET    | `/api/v1/posts/:postId/comments`     | List comments  | No   |
| POST   | `/api/v1/posts/:postId/comments`     | Add comment    | Yes  |
| DELETE | `/api/v1/posts/:postId/comments/:id` | Delete comment | Yes  |

### Tags

| Method | Endpoint       | Description   | Auth |
| ------ | -------------- | ------------- | ---- |
| GET    | `/api/v1/tags` | List all tags | No   |
| POST   | `/api/v1/tags` | Create tag    | Yes  |

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer your-token-here
```

Get a token by registering or logging in.
