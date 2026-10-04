# CampusBite — Full MERN Architecture

## 1. System Architecture Overview

CampusBite is engineered as a modern, decoupled **MERN stack monorepo** designed for high availability, sub-second latency, and intuitive canteen kitchen operations.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        React + Vite Client (SPA)                        │
│  - React Router v7 (Protected & Staff Route Boundaries)                 │
│  - AuthContext (JWT Session Sync via HTTP-Only SameSite Cookies)         │
│  - CartContext (Client-Side Tray State + Pickup Scheduling)              │
│  - Semantic Food-First Design System (CSS Custom Properties)            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ JSON REST API (credentials: 'include')
                                     v
┌─────────────────────────────────────────────────────────────────────────┐
│                     Node.js + Express REST API Server                   │
│  - Middleware: CORS with origin validation, cookie-parser, JSON parser   │
│  - Security: protect (JWT), requireStaff (Role Guard), errorHandler     │
│  - Business Logic: Authoritative Server Price Recalculation             │
│  - Token Generator: Collision-Resistant Unique CB-XXXX Tokens           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ Mongoose ODM
                                     v
┌─────────────────────────────────────────────────────────────────────────┐
│                             MongoDB Database                            │
│  - Users: email uniqueness index, bcrypt password hashing                │
│  - MenuItems: category, diet (VEG/NON_VEG), stock availability flag      │
│  - Orders: embedded items with MenuItem refs, status, token, pickup      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout & Monorepo Boundaries

```
campusbite/
│
├── client/                     # React + Vite Single Page Application
│   ├── public/
│   │   └── images/             # 14 authentic culinary food & background assets
│   ├── src/
│   │   ├── assets/             # Static icons & vectors
│   │   ├── components/         # Modular reusable UI components
│   │   │   ├── cart/           # CartDrawer, PickupScheduler
│   │   │   ├── common/         # Navbar, Footer, ProtectedRoute, StaffRoute
│   │   │   ├── menu/           # CategoryNav, FoodCard
│   │   │   └── orders/         # TokenBadge, LiveStatusTimeline
│   │   ├── context/            # React AuthContext & CartContext
│   │   ├── pages/              # Route views (Home, Menu, Login, Register, Checkout, Tracker, Staff)
│   │   ├── services/           # Centralized API service client (api.js)
│   │   ├── styles/             # Global CSS Design Tokens & Utilities (index.css)
│   │   ├── App.jsx             # Top-level route tree & layout wrappers
│   │   └── main.jsx            # React root mount
│   ├── index.html              # HTML entry with Google Fonts
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express REST API Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection logic (db.js)
│   │   ├── controllers/        # Route controllers (authController, menuController, orderController)
│   │   ├── middleware/         # Auth verification (protect, requireStaff) & error handlers
│   │   ├── models/             # Mongoose schemas (User, MenuItem, Order)
│   │   ├── routes/             # Express routers (authRoutes, menuRoutes, orderRoutes)
│   │   ├── seeds/              # Database seed script with hashed passwords (seed.js)
│   │   ├── app.js              # Express app configuration & middleware mounts
│   │   └── server.js           # Server listener entry point
│   ├── .env.example
│   └── package.json
│
├── legacy/                     # Archived legacy Java Servlets, JSP & SQL files
├── package.json                # Root monorepo orchestration
├── README.md
├── ARCHITECTURE.md
├── DESIGN.md
├── API.md
├── MIGRATION_ANALYSIS.md
└── MIGRATION.md
```

---

## 3. Data Flow & Security Model

### A. Authentication & Session Flow
1. User submits login form with email and password to `POST /api/auth/login`.
2. Backend locates user, performs constant-time password comparison using `bcrypt.compare`.
3. Upon success, an encrypted JWT (`{ id, role }`) is signed and attached as an **HTTP-Only, SameSite=Lax (Strict in Prod), Secure** cookie (`token`) with a 7-day expiration.
4. Client context calls `GET /api/auth/me` on mount to verify session state without exposing raw tokens to `localStorage` or JavaScript scope (XSS-immune).

### B. Order Placement & Price Integrity Guard
1. Client adds items to tray and selects pickup window (`Immediate`, `15mins`, `30mins`, `45mins`, `1hour`).
2. Client sends **only item IDs and quantities** to `POST /api/orders` along with pickup timing.
3. Express server intercepts payload, queries MongoDB for the authoritative prices of every item ID, validates real-time stock availability (`available !== false`), and computes the subtotal entirely server-side.
4. An atomic, collision-tested token (e.g. `CB-1042`) is generated and attached to the order.

### C. Kitchen Lifecycle State Machine
Orders transition strictly through verified state paths:
$$\text{PENDING} \longrightarrow \text{PREPARING} \longrightarrow \text{READY} \longrightarrow \text{COMPLETED}$$
Illegal skips or regressions (e.g., `COMPLETED` $\rightarrow$ `PENDING`) are rejected with `400 Bad Request` at the controller layer.
