# CampusBite 22-Step Migration Roadmap & Execution Order

## 1. Phased Migration Methodology
To ensure zero regression, total data integrity, and a smooth handover from the legacy Java system to the modern MERN stack, the migration is structured into 22 incremental, verifiable phases.

```text
[Phase 01: Audit & Decode] ➔ [Phases 02-05: Foundation] ➔ [Phases 06-10: Customer Experience] ➔ [Phases 11-16: Orders & Staff] ➔ [Phases 17-22: QA, Polish & Release]
```

---

## 2. Sequential Phase Execution Breakdown

### Phase 01: Repository Audit, Decode & Architecture Freeze *(Active Phase)*
- **Objective**: Full structural, security, database, API, and UI/UX audit of the legacy repository.
- **Deliverables**: Comprehensive audit documents (`docs/*`), legacy archive isolation (`legacy/`), and baseline freeze.
- **Status**: COMPLETE.

### Phase 02: MERN Monorepo Scaffolding
- **Objective**: Establish production monorepo directory layout with `server/` (Node/Express) and `client/` (React/Vite).
- **Deliverables**: Root `package.json` with workspace scripts (`npm run dev`, `npm run build`), ESLint, Prettier, and environment configs.

### Phase 03: MongoDB & Mongoose Connection Layer
- **Objective**: Resilient database connection module with automated reconnects, connection pooling, and error handling.
- **Deliverables**: `server/src/config/db.js` with development and production cluster support.

### Phase 04: Mongoose Schemas & Domain Models
- **Objective**: Implement robust, indexed, validated schemas for User, MenuItem, and Order.
- **Deliverables**: `models/User.js`, `models/MenuItem.js`, `models/Order.js` with virtuals and hooks.

### Phase 05: Data Seeding Engine
- **Objective**: Create reproducible database seed script preserving legacy menu catalog items and default staff credentials.
- **Deliverables**: `server/src/seeds/seed.js` with 9 authentic dishes and test accounts (`admin@canteen.com`, `student@campus.edu`).

### Phase 06: Authentication & Authorization Backend
- **Objective**: Secure JWT-based authentication pipeline with bcrypt hashing and RBAC middleware.
- **Deliverables**: `authController.js`, `authMiddleware.js`, `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.

### Phase 07: Authentication Frontend & Protected Routes
- **Objective**: React AuthContext, Login, Register views, and route guards (`ProtectedRoute`, `StaffRoute`).
- **Deliverables**: Context provider with token refresh and automatic session restoration.

### Phase 08: Menu Catalog Backend API
- **Objective**: RESTful endpoints for reading, searching, filtering, and managing menu items.
- **Deliverables**: `menuController.js`, `menuRoutes.js`, support for `?category=`, `?diet=`, `?search=`.

### Phase 09: Menu Experience & Discovery Frontend
- **Objective**: Responsive menu grid with live category pills, diet badges, debounced search, and food imagery.
- **Deliverables**: `MenuGrid.jsx`, `MenuCard.jsx`, `CategoryFilter.jsx`, `DietFilter.jsx`.

### Phase 10: Client-Side Cart System
- **Objective**: Persistent, responsive cart drawer with increment/decrement, tax calculations, and clear actions.
- **Deliverables**: `CartContext.jsx`, `CartDrawer.jsx`, `CartItem.jsx` syncing to localStorage.

### Phase 11: Orders & Fulfillment Backend Engine
- **Objective**: Server-authoritative order calculation, unique token generation, and database persistence.
- **Deliverables**: `orderController.js`, `orderRoutes.js`, `POST /api/orders`, `GET /api/orders/my`.

### Phase 12: Checkout & Pickup Scheduling Experience
- **Objective**: Checkout modal/page with slot picker (`PICKUP_NOW` vs `SCHEDULED`) and order summary.
- **Deliverables**: `CheckoutModal.jsx`, `PickupSelector.jsx`.

### Phase 13: Customer Order History & Status Timeline
- **Objective**: Customer dashboard displaying active pickup tokens, preparation progress, and past receipts.
- **Deliverables**: `OrdersView.jsx`, `OrderTokenBadge.jsx`, `StatusTimeline.jsx`.

### Phase 14: Staff Kitchen API & Status Transition Controls
- **Objective**: Specialized endpoints for kitchen staff to retrieve live orders and advance status.
- **Deliverables**: `GET /api/orders/staff`, `PATCH /api/orders/:id/status` with RBAC protection.

### Phase 15: Staff Kitchen Kanban Board
- **Objective**: Real-time staff dashboard with drag/column view for `PLACED`, `PREPARING`, `READY`, and `COMPLETED`.
- **Deliverables**: `StaffDashboard.jsx`, `KitchenTicket.jsx`, audio chime triggers on new orders.

### Phase 16: Menu Management for Staff
- **Objective**: In-dashboard staff controls to toggle dish availability (`In Stock` / `Sold Out`) and edit pricing.
- **Deliverables**: `StaffMenuManager.jsx`, `PATCH /api/menu/:id/availability`.

### Phase 17: Payment Simulation & Sandbox Cleanup
- **Objective**: Explicitly labeled demo UPI QR payment modal with clear simulation indicator and receipt download.
- **Deliverables**: `PaymentModal.jsx` with instant simulation approval.

### Phase 18: UI/UX Craft, Design Tokens & Animation Polish
- **Objective**: Apply CampusBite orange design system, micro-interactions, smooth entrance transitions, and dark/warm tones.
- **Deliverables**: CSS variables, responsive typography, polished empty and skeleton states.

### Phase 19: Responsive & Accessibility QA
- **Objective**: Verify mobile layouts (320px to 1440px+), touch targets, WCAG 2.1 AA contrast, and keyboard navigation.
- **Deliverables**: Playwright accessibility audit and viewport test matrix report.

### Phase 20: Security & Vulnerability QA
- **Objective**: Automated security checks verifying elimination of all legacy vulnerabilities (SEC-01 through SEC-08).
- **Deliverables**: Automated test suite asserting role escalation defense, price manipulation immunity, and IDOR protection.

### Phase 21: Production Build & Deployment Setup
- **Objective**: Configure unified production build, Vercel/Render deployment configs, and environment variable templates.
- **Deliverables**: `render.yaml`, `vercel.json`, production bundle optimizations.

### Phase 22: Legacy Codebase Cleanup & Archival
- **Objective**: Finalize archival of legacy Java/Servlet artifacts into documentation reference archive without data loss.
- **Deliverables**: Clean root directory structure, verified documentation, and migration signoff.
