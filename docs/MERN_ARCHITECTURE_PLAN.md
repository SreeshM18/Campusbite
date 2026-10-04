# CampusBite — MERN Architecture Plan & Technical Specification

## 1. Target Monorepo Structure

```text
campusbite/
├── client/                     # React 19 + Vite Single Page Application
│   ├── public/
│   │   └── images/             # 14 authentic food & background assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── cart/           # CartDrawer.jsx, PickupScheduler.jsx
│   │   │   ├── common/         # Navbar.jsx, Footer.jsx, ProtectedRoute.jsx, StaffRoute.jsx
│   │   │   ├── menu/           # CategoryNav.jsx, FoodCard.jsx
│   │   │   └── orders/         # TokenBadge.jsx, LiveStatusTimeline.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Cookie session & user role state
│   │   │   └── CartContext.jsx # Client tray items & pickup scheduling
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── StaffDashboardPage.jsx
│   │   │   ├── StaffMenuPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized fetch client with credentials: 'include'
│   │   ├── styles/
│   │   │   └── index.css       # Semantic CSS custom property tokens
│   │   ├── App.jsx             # Top-level route tree & layout
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB connection & auto-seed fallback
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── menuController.js
│   │   │   └── orderController.js
│   │   ├── middleware/
│   │   │   ├── auth.js         # protect (JWT) & requireStaff guards
│   │   │   └── error.js        # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js         # Mongoose User model with bcrypt & role constraints
│   │   │   ├── MenuItem.js     # Mongoose MenuItem model with stock flag
│   │   │   └── Order.js        # Mongoose Order model with embedded items & token
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── seeds/
│   │   │   └── seed.js         # Production seed script with pre-hashed accounts
│   │   ├── app.js              # Express app configuration & middleware mounts
│   │   └── server.js           # Server listener entry point
│   ├── .env.example
│   └── package.json
│
├── legacy/                     # Archived legacy Java Servlets, JSP & SQL files
├── package.json                # Root monorepo orchestration
└── docs/                       # Migration specifications & technical blueprints
```

---

## 2. State & Data Ownership Contract

| Data Domain | Single Source of Truth | Transport Mechanism | Client Persistence |
| :--- | :--- | :--- | :--- |
| **User Identity & Role** | MongoDB `users` collection | HTTP-Only Cookie (`token`) $\rightarrow$ `GET /api/auth/me` | Memory state (`AuthContext`) |
| **Menu Catalog & Stock** | MongoDB `menuitems` collection | `GET /api/menu` | Component state (instant refetch) |
| **Cart Tray & Schedule** | Client Browser | Local state | `localStorage` (`campusbite_cart_v2`) |
| **Orders & Tokens** | MongoDB `orders` collection | `POST /api/orders`, `GET /api/orders/*` | MongoDB (Authoritative) |
| **Kitchen Queue State** | MongoDB `orders` collection | `GET /api/orders/staff/all`, `PATCH /api/orders/:id/status` | Polled MongoDB stream |

---

## 3. Order Processing & Server Recalculation Flow

```text
[React Client] ── POST /api/orders ──> [Express orderController.createOrder]
Payload:                                       │
- items: [{ menuItemId, quantity }]            │ 1. Extract item IDs
- pickupType: "15mins"                         │ 2. Query MenuItem collection in MongoDB
- pickupTime: "In 15 Minutes (~1:15 PM)"       │ 3. Fetch authoritative DB prices
- paymentMethod: "UPI"                         │ 4. Verify item.available === true
- specialInstructions: "Extra spicy"           │ 5. Calculate official subtotal: SUM(price * qty)
                                               │ 6. Generate collision-safe token: "CB-1042"
                                               │ 7. Save Order document to MongoDB
                                               ▼
[React Client] <── 201 Created ──────── [Return Saved Order with Token]
```
