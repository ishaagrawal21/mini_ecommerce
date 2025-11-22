# Mini E-Commerce Feature

A mini E-Commerce product management system (frontend + backend) built with Node.js, Express, MongoDB, React, TanStack Query and Material UI. Supports full CRUD for products, search & filter, and a responsive UI.

## Features
- REST API for Products (name, description, price, category, imageURL)
- Validation using Joi
- Product listing with search and category filter
- Add / Edit / Delete products from dashboard
- Frontend uses TanStack Query (useQuery, useMutation) for data fetching
- Responsive MUI UI

---

## Project Structure



---

## Prerequisites
- Node.js
- MongoDB running locally or a MongoDB URI
-  npm

---

## Backend Setup

```bash
cd server
cp .env
# edit .env and set MONGO_URI
npm install
npm start
# server runs on PORT (default 5000)

cd frontend
cp .env
# optionally edit VITE_API_URL if backend is remote
npm install
npm run dev
# app opens (Vite) on http://localhost:5173 (or shown in terminal)