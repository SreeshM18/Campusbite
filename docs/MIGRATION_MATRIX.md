# CampusBite Feature-by-Feature Migration Matrix

## 1. Overview
This matrix tracks the migration of all functional features from the legacy Java / Servlet / MySQL / Vanilla JS implementation into the production MERN (MongoDB, Express, React 19, Node.js) architecture.

---

## 2. Master Feature Migration Matrix

| Existing Feature | Current Implementation | Problem / Architectural Defect | MERN Replacement | Priority | Phase 01 Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Registration** | `register.html`, `auth.js`, `AuthController.java` | Plaintext passwords; allows user to self-select `CANTEEN_STAFF` role directly from client form. | `POST /api/auth/register` with bcrypt (salt rounds 10), role restricted to `STUDENT`/`FACULTY`. | **P0** | Planned & Verified |
| **User Login** | `login.html`, `auth.js`, `AuthController.java`, `UserDAO.java` | Plaintext SQL equality checks (`WHERE email=? AND password=?`); sets unverified role in client `localStorage`. | `POST /api/auth/login` with JWT + HttpOnly secure cookie and sanitized user payload. | **P0** | Planned & Verified |
| **Session & Auth State** | `localStorage.getItem("canteen_session")` | Tamperable client state; anyone can edit localStorage to elevate privileges to staff. | `AuthContext` with `/api/auth/me` verification and signed stateless JWT. | **P0** | Planned & Verified |
| **Menu Catalog Browsing** | Hardcoded catalog in `menu.js`, fallback to `GET /api/menu` | Java API and client catalog out of sync; static deployment bypasses MySQL database completely. | `GET /api/menu` from MongoDB with active cache and category/diet query parameters. | **P0** | Planned & Verified |
| **Diet & Category Filters** | Client-side DOM filtering in `menu.js` | Inconsistent DOM selectors; fragile class-based toggle; missing active indicator styling. | React stateful `CategoryFilter` & `DietFilter` components controlling filtered item list. | **P0** | Planned & Verified |
| **Live Menu Search** | Vanilla JS `input` event listener in `menu.js` | Re-renders entire DOM innerHTML on every keyup; sluggish performance and poor mobile input handling. | Debounced React search input filtering stateful menu grid in memory with empty states. | **P0** | Planned & Verified |
| **Food Imagery System** | External Unsplash URLs with broken hotlinking | External URLs frequently break, throttle, or fail offline; images lack uniform aspect ratio. | Local WebP / optimized JPG assets served from CDN/public directory with lazy loading. | **P0** | Planned & Verified |
| **Cart Management** | `localStorage.getItem("cart")` in `menu.js` | Duplicate item logic flawed; price stored in client cart and trusted on checkout. | `CartContext` React state persisting to `localStorage.campusbite_cart_v1` with validation. | **P0** | Planned & Verified |
| **Pickup Scheduling** | Hidden / broken select element in `index.html` | JavaScript references missing DOM IDs; scheduling data dropped before reaching backend. | React `PickupSelector` (`PICKUP_NOW` vs `SCHEDULED` with time picker) saved in Order schema. | **P1** | Planned & Verified |
| **Order Placement** | `POST /api/orders` in `OrderController.java` & `menu.js` | Server blindly trusted client-calculated `totalAmount`; IDOR vulnerability on order fetching. | `POST /api/orders` recalculating item prices from MongoDB; generating unique token `TK-YYYYMMDD-XXXX`. | **P0** | Planned & Verified |
| **Order Token Generation** | Math.random() in `menu.js` | Collisions on client; not unique; no verification on pickup. | Server-generated sequential or cryptographically unique tokens indexed in MongoDB. | **P0** | Planned & Verified |
| **Payment Simulation** | Client UPI modal with static QR code | Simulation was indistinguishable from real gateway; gave false impression of bank verification. | Explicitly labeled Sandbox UPI QR payment modal with instant verification webhook hook. | **P1** | Planned & Verified |
| **Customer Order History** | `localStorage.getItem("canteen_orders")` | Disconnected across devices; cleared when browser cache is flushed. | `GET /api/orders/my` fetching authenticated user orders from MongoDB with live status timeline. | **P1** | Planned & Verified |
| **Staff Dashboard** | `admin.html` with two conflicting JS scripts | `admin.js` expected API while inline script used `localStorage`; non-staff could view page. | Protected `/staff` route in React with `StaffRoute` guard + `GET /api/orders/staff`. | **P0** | Planned & Verified |
| **Order Status Workflow** | `PATCH /api/orders/status` without auth | Anyone could change any order to `COMPLETED` by sending raw HTTP patch requests. | `PATCH /api/orders/:id/status` guarded by `role: CANTEEN_STAFF` with state machine checks. | **P0** | Planned & Verified |
| **Menu Item Availability** | `admin.html` toggle button modifying localStorage | Toggled status was not persisted to MySQL or seen by other connected student devices. | `PATCH /api/menu/:id/availability` updating MongoDB and reflecting immediately to all users. | **P1** | Planned & Verified |
| **Customer Reviews & Feedback** | `feedback.html` / simulated form in footer | Data discarded on submit; no API or table existed to store customer ratings. | `POST /api/reviews` endpoint with Review schema in MongoDB (P2 roadmap). | **P2** | Roadmap Reserved |
| **Real-time Notifications** | Polling in `admin.js` (every 5 seconds) | Inefficient HTTP polling causing unnecessary server load and delayed order sound alerts. | WebSocket / Server-Sent Events (SSE) notification channel for live ticket alerts. | **P3** | Roadmap Reserved |

---

## 3. Priority Definitions
- **P0 (Critical / Mandatory)**: Core transaction flow (Auth, Menu, Cart, Orders, Staff Board). Must be 100% functional before launch.
- **P1 (Important / Core UX)**: Customer order history, pickup slot selector, staff menu item toggle, and sandbox payment flows.
- **P2 (Enhancements)**: Reviews, ratings, customer profile settings, advanced analytics.
- **P3 (Future Work)**: Real-time WebSockets, automated SMS/WhatsApp alerts, production payment gateway integration (Razorpay/Stripe).
