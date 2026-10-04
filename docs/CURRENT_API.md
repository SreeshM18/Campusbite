# CampusBite — Legacy API Inventory & Mapping

## 1. Standalone JDK Server Endpoints (`Server.java`)

| Method | Path | Request Payload | Response Body | Auth / Role | DB Action | Frontend Usage | MERN Replacement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Form URL-encoded (`email`, `password`) | `{"status":"success","message":"Login successful"}` | None | Plaintext SQL query `SELECT * FROM users WHERE email=? AND password=?` | Invoked only if `Server.java` was explicitly started. | `POST /api/auth/login` |
| `POST` | `/api/register` | Form URL-encoded (`name`, `email`, `password`, `role`) | `{"status":"success","message":"Registered successfully"}` | None | Plaintext SQL query `INSERT INTO users (name, email, password, role) VALUES (...)` | Bypassed by `auth.js` localStorage logic. | `POST /api/auth/register` |
| `GET` | `/*` | None | Static file byte stream (HTML/CSS/JS/images) | None | File system read (`./src/main/webapp/*`) | Used to serve static assets on port 8080. | Vite SPA Dev / Express Static |

---

## 2. Jakarta Servlet Endpoints (`src/main/java/com/canteen/controller/*`)

### A. `AuthController.java` (`@WebServlet("/api/auth/*")`)

| Method | Sub-Path | Request JSON | Response JSON | Auth / Role | DB Action | Frontend Usage | Issues & MERN Replacement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `User` POJO (`name`, `email`, `password`, `role`) | `{"success": true, "message": "User registered successfully!"}` | None | Calls `UserDAO.registerUser()` | Never called by vanilla frontend. | Plaintext password stored; replaced by `POST /api/auth/register` with bcrypt. |
| `POST` | `/api/auth/login` | `User` POJO (`email`, `password`) | `{"success": true, "user": {...}}` | None | Calls `UserDAO.loginUser()` | Never called by vanilla frontend. | Plaintext password comparison; returns password in JSON; replaced by `POST /api/auth/login` with JWT cookie. |

---

### B. `MenuController.java` (`@WebServlet("/api/menu/*")`)

| Method | Sub-Path | Request JSON | Response JSON | Auth / Role | DB Action | Frontend Usage | Issues & MERN Replacement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/menu` | None | Array of `MenuItem` (`is_available = true`) | Public | Calls `MenuDAO.getAllAvailableItems()` | Unused; frontend loaded `defaultFoodItems` from JS array. | Replaced by `GET /api/menu`. |
| `GET` | `/api/menu/all` | None | Array of all `MenuItem` records | Public (Unprotected!) | Calls `MenuDAO.getAllItems()` | Unused. | No admin role check; replaced by `GET /api/menu?all=true`. |
| `PUT` | `/api/menu/availability` | `{"itemId": 1, "isAvailable": false}` | `{"success": true, "message": "Item status updated."}` | None (Unprotected!) | Calls `MenuDAO.updateAvailability()` | Unused. | Missing staff authorization gate; replaced by `PATCH /api/menu/:id/availability`. |

---

### C. `OrderController.java` (`@WebServlet("/api/orders/*")`)

| Method | Sub-Path | Request JSON | Response JSON | Auth / Role | DB Action | Frontend Usage | Issues & MERN Replacement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/orders?userId=1` | Query param `userId` | Array of `Order` POJOs | None (Insecure!) | Calls `OrderDAO.getOrdersByUserId()` | Unused; frontend read `canteen_orders` from localStorage. | IDOR vulnerability (any user could read anyone's orders by changing `userId`); replaced by `GET /api/orders/my`. |
| `POST` | `/api/orders` | `Order` POJO (including client-calculated `totalAmount` & `items`) | `{"success": true, "message": "Pre-order placed successfully!"}` | None | Calls `OrderDAO.placeOrder()` | Unused. | Trusts client `totalAmount`; no token generated; replaced by `POST /api/orders` with authoritative server recalculation and `CB-XXXX` token generation. |
| `PUT` | `/api/orders/status` | `{"orderId": 10, "status": "READY"}` | `{"success": true, "message": "Order status updated."}` | None (Unprotected!) | Calls `OrderDAO.updateOrderStatus()` | Unused. | No role check; allows arbitrary state jumps; replaced by `PATCH /api/orders/:id/status`. |

---

## 3. LocalStorage Keys & State Audit

| LocalStorage Key | Current Contents & Role | Target Action | Reason & Destination |
| :--- | :--- | :--- | :--- |
| `canteen_users` | Array of registered user objects with plaintext passwords | **REMOVE** | Replaced by MongoDB `users` collection with salted bcrypt hashes. |
| `canteen_session` | Unencrypted active user session object | **REMOVE** | Replaced by encrypted JWT stored in HTTP-Only, SameSite cookies (`token`). |
| `bytebite_user_cart` | Active items added to dining tray | **KEEP** (Client-side) | Client-side cart persistence via `CartContext` (`campusbite_cart_v2`). |
| `bytebite_catalog_v3` | Client-side menu item catalog | **REMOVE** | Replaced by MongoDB `menuitems` collection queried dynamically via `/api/menu`. |
| `canteen_orders` | Global orders array stored inside browser | **REMOVE** | Replaced by MongoDB `orders` collection synchronized across all customer and staff devices. |
