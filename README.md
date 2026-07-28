# Car Dealership Inventory System (AutoVault)

Full-stack Car Dealership Inventory System built as a take-home assignment for Incubyte Consulting.

- **GitHub Repository**: [https://github.com/sachin-ydv/incubyte](https://github.com/sachin-ydv/incubyte)

---

## Technical Stack & Decisions

- **Backend**: Node.js, Express.js, JavaScript
- **Database**: MongoDB with Mongoose (`mongodb-memory-server` for test suite)
- **Auth**: JWT (`jsonwebtoken` + `bcryptjs`), Roles: `user` and `admin`
- **Testing**: Jest + Supertest for backend TDD
- **Frontend**: React + Tailwind CSS, built with Vite
- **Folder Structure**: `/backend` and `/frontend` separate root folders

---

## Features Implemented

1. **Project Scaffold & Schemas**: Express server boilerplate, Mongoose connection, User schema (with roles `user` and `admin`), Vehicle schema (`make`, `model`, `category`, `year`, `price`, `quantity`).
2. **Auth API**: `POST /api/auth/register`, `POST /api/auth/login`, JWT verification & role authorization middleware (`protect`, `adminOnly`).
3. **Vehicle CRUD API**: `GET /api/vehicles`, `GET /api/vehicles/:id`, `POST /api/vehicles` (admin), `PUT /api/vehicles/:id` (admin), `DELETE /api/vehicles/:id` (admin).
4. **Search API**: `GET /api/vehicles/search` with case-insensitive `make`, `model`, `category`, and price range (`minPrice`, `maxPrice`) filters.
5. **Atomic Purchase & Restock**:
   - `POST /api/vehicles/:id/purchase`: Atomic `findOneAndUpdate` with `$inc: { quantity: -1 }` and quantity guard (`quantity: { $gt: 0 }`) to prevent race conditions.
   - `POST /api/vehicles/:id/restock`: Atomic `findOneAndUpdate` with `$inc: { quantity: amount }` (admin only).
6. **Frontend Auth UI**: React + Vite + Tailwind CSS Login and Register forms with `AuthContext` state management & JWT persistence.
7. **Frontend Dashboard & Search UI**: Live vehicle grid, search/filter bar, metrics header, and Purchase button (disabled when quantity is 0).
8. **Frontend Admin Management UI**: Modal forms for adding new vehicles, editing existing vehicles, deleting vehicles, and restocking inventory.

---

## Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB URI set in `process.env.MONGODB_URI` (Defaults to `mongodb://localhost:27017/car_dealership`)

### 1. Backend Setup & Testing
```bash
cd backend
cmd /c npm install
cmd /c node node_modules/jest/bin/jest.js --runInBand   # Runs all 37 TDD tests
cmd /c npm start                                         # Starts server on port 5000
```

### 2. Frontend Setup & Running
```bash
cd frontend
cmd /c npm install
cmd /c node node_modules/vite/bin/vite.js                # Starts dev server on port 3000
```

---

## Build Order Checklist

- [x] **Step 1: Project scaffold & schemas**
- [x] **Step 2: Auth** (`POST /api/auth/register`, `POST /api/auth/login`, JWT middleware)
- [x] **Step 3: Vehicle CRUD** (`POST/GET/PUT/DELETE /api/vehicles` - protected)
- [x] **Step 4: Search** (`GET /api/vehicles/search` by make, model, category, price range)
- [x] **Step 5: Atomic Purchase & Restock** (`POST /api/vehicles/:id/purchase`, `POST /api/vehicles/:id/restock`)
- [x] **Step 6: Frontend Auth UI** (Login & Register forms)
- [x] **Step 7: Frontend Dashboard & Search UI** (Dashboard, search/filters, purchase button disabled at 0 quantity)
- [x] **Step 8: Frontend Admin Management UI** (Add, Edit, Delete, Restock modals)
