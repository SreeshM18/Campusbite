# CampusBite — Comprehensive Migration Guide

This document maps every layer of the legacy Java/Jakarta + MySQL + Vanilla JS stack to its modern production-grade MERN equivalent.

---

## 1. Architectural Component Mapping

| Concern | Legacy Implementation | MERN Architecture | Key Improvements |
| :--- | :--- | :--- | :--- |
| **Server Engine** | `Server.java` + Jakarta `HttpServlet` | Node.js + Express.js (`server/src/app.js`) | Single unified server, async non-blocking event loop, native JSON stream parsing. |
| **Authentication** | Plaintext SQL query & `localStorage` user object | JWT in HTTP-Only SameSite Cookies + bcryptjs (`server/src/middleware/auth.js`) | 100% immune to XSS token theft; zero plaintext passwords; server-enforced role verification. |
| **Data Layer** | JDBC + MySQL Tables (`canteen_db`) | MongoDB + Mongoose Schemas (`server/src/models/*`) | Flexible nested order items; atomic token constraints; clean JSON projections without boilerplate DAOs. |
| **Menu System** | Hardcoded JS array fallback in `menu.js` | Authoritative MongoDB `MenuItem` collection | Real-time stock availability toggling (`available: false`); dynamic categories and dietary filtering. |
| **Order Processing** | Client-calculated totals stored in `localStorage` | Authoritative server price verification (`orderController.js`) | Eliminates client price tampering; server-generated `CB-XXXX` token; strict lifecycle transitions. |
| **Frontend UI** | Multi-page static HTML (`index.html`, `admin.html`) | React 19 + Vite Single Page Application | Component reusability, instant client-side routing, shared state contexts, responsive cart drawer. |
| **Staff Dashboard** | `admin.html` reading `localStorage` | `StaffDashboardPage.jsx` (`/staff/orders`) | Real-time multi-client syncing via MongoDB; kitchen KPI stats; 1-click status advancement. |

---

## 2. File-by-File Lineage & Replacement Matrix

### Backend & API
- `Server.java` & `src/main/java/com/canteen/controller/AuthController.java` $\longrightarrow$ `server/src/controllers/authController.js` + `server/src/routes/authRoutes.js`
- `src/main/java/com/canteen/controller/MenuController.java` $\longrightarrow$ `server/src/controllers/menuController.js` + `server/src/routes/menuRoutes.js`
- `src/main/java/com/canteen/controller/OrderController.java` $\longrightarrow$ `server/src/controllers/orderController.js` + `server/src/routes/orderRoutes.js`
- `src/main/java/com/canteen/dao/UserDAO.java` $\longrightarrow$ `server/src/models/User.js`
- `src/main/java/com/canteen/dao/MenuDAO.java` $\longrightarrow$ `server/src/models/MenuItem.js`
- `src/main/java/com/canteen/dao/OrderDAO.java` $\longrightarrow$ `server/src/models/Order.js`
- `sql/schema.sql` $\longrightarrow$ Mongoose schema definitions in `server/src/models/` + `server/src/seeds/seed.js`

### Frontend & Client
- `src/main/webapp/index.html` + `js/menu.js` $\longrightarrow$ `client/src/pages/HomePage.jsx`, `client/src/pages/MenuPage.jsx`, `client/src/components/menu/*`
- `src/main/webapp/login.html` + `src/main/webapp/register.html` + `js/auth.js` $\longrightarrow$ `client/src/pages/LoginPage.jsx`, `client/src/pages/RegisterPage.jsx`, `client/src/context/AuthContext.jsx`
- `src/main/webapp/admin.html` + `js/admin.js` $\longrightarrow$ `client/src/pages/StaffDashboardPage.jsx`, `client/src/pages/StaffMenuPage.jsx`
- `src/main/webapp/css/style.css` $\longrightarrow$ `client/src/styles/index.css` (Semantic CSS Custom Property Tokens)

---

## 3. Resolving Legacy Bugs & Architectural Inconsistencies

1. **Eliminated State Divergence**:
   - In legacy, an order placed in `index.html` was saved only to the customer's browser `localStorage`, making it invisible to staff on another machine. In MERN, all orders persist to MongoDB and are retrieved in real-time by kitchen staff.
2. **Fixed Client-Side Price Tampering**:
   - In legacy, the client computed the total and passed it directly to the database. In MERN, the client passes only item IDs and quantities; the server fetches the official prices from MongoDB and computes the subtotal.
3. **Fixed Dynamic Demo Payment**:
   - In legacy, the UPI modal rendered a hardcoded ₹100 QR code. In MERN, the sandbox QR code and payment intent dynamically reflect the exact calculated subtotal.
