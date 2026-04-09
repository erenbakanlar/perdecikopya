# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DuranOğlu Perde — a full-stack e-commerce site for curtains (perde). Turkish-language UI. Built with Vanilla JS + HTML/CSS on the frontend and Node.js/Express/MySQL on the backend.

## Commands

### Frontend
```bash
npm run dev        # Start Vite dev server (http://localhost:3000)
npm run build      # Build to dist/
npm run preview    # Preview production build
```

### Backend
```bash
npm run backend    # Start backend with nodemon (from root, runs cd backend && npm run dev)
# or directly:
cd backend && npm run dev   # http://localhost:5000
cd backend && npm start     # production
```

### Database
```bash
npm run seed       # Seed DB with sample products and test users
# or: cd backend && node seed.js
```

Test credentials after seeding:
- Admin: `admin@duranogluperde.com` / `admin123` → `/admin-login.html`
- User: `test@test.com` / `test123`

## Architecture

### Frontend (Vanilla JS, no framework)
- Static HTML pages, each page includes `api.js` and `auth.js` via `<script>` tags
- **`api.js`** — all backend calls; exposes a single `window.API` object with auth, product, and order methods. Uses `localStorage` for JWT token (`token`) and user info (`currentUser`)
- **`auth.js`** — auth helper functions shared across pages
- **`cart.js`** — cart state stored in `localStorage` (works offline; synced to backend on checkout)
- **`script.js`** — main page logic (product listing, filters, etc.)
- **`checkout.js`** — checkout flow, calls `window.API.createOrder()`
- **`admin.js`** — admin panel logic (order/product management)

Admin pages (`admin-*.html`) check `window.API.isAdmin()` and redirect if not admin.

### Backend (Express + mysql2)
```
backend/
├── server.js          # Entry point, mounts routes at /api/*
├── config/db.js       # MySQL connection pool + table creation
├── models/            # User, Product, Order (SQL query wrappers)
├── controllers/       # authController, productController, orderController
├── routes/            # auth.js, products.js, orders.js
├── middleware/auth.js  # JWT verify middleware (protects routes)
└── seed.js            # Populates DB with initial data
```

MySQL tables: `users`, `products`, `orders`, `order_items`

API base URL (frontend hardcoded): `http://localhost:5000/api`

### Auth flow
- JWT issued on login/register, stored in `localStorage`
- Protected routes require `Authorization: Bearer <token>` header
- Admin-only routes additionally check `user.role === 'admin'` in the JWT middleware

### Environment
Backend requires `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=duranoglu_perde
JWT_SECRET=<secret>
PORT=5000
NODE_ENV=development
```

XAMPP MySQL default: host=localhost, user=root, password="" (boş)
