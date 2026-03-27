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
