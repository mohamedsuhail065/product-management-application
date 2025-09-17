# Product Management App

This repository contains the full stack product management application with a React frontend and Express backend.

## Features
- Browse, search, and filter products
- Manage product wishlist
- Pagination and variants support
- Image upload for products
- JWT authentication

## Client (React + Vite)

### Setup
- Requires Node.js (16+)
- Install dependencies: `cd client && npm install`
- Run dev server: `npm run dev`

### Environment
- Create `.env` in `/client` root with:


- Access with `import.meta.env.VITE_API_URL`

### Scripts
- `npm run dev` - start dev server
- `npm run build` - build production

## Server (Node.js + Express)

### Setup
- Requires Node.js (16+) and MongoDB
- Install dependencies: `cd server && npm install`
- Start dev server: `npm run dev`
- Runs on http://localhost:5000 by default

### Environment
- Create `.env` in `/server` root:
