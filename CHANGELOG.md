# Changelog

All notable changes to the **CampusBite - Smart Campus Canteen Pre-Ordering Platform** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-04 — Final Production MERN Release

### Added (Full-Stack MERN Architecture)
- **Phase 12–13: Full-System QA, Production Deployment & GitHub Ecosystem**:
  - Automated CI pipeline in `.github/workflows/ci.yml` verifying test suites and Vite production bundle.
  - Complete documentation suite (`docs/DEPLOYMENT.md`, `docs/DEMO_SCRIPT.md`, `docs/QA_REPORT.md`, `docs/QA_MASTER_PLAN.md`, `docs/BUG_LOG.md`).
  - Production SPA rewrites (`vercel.json` and `_redirects`).
  - Reduced-motion support (`prefers-reduced-motion`) and visible keyboard focus rings across all UI components.
- **Phase 11: Authentication, Identity, Roles & Security Hardening**:
  - Secure identity system for 3 campus roles: `STUDENT`, `FACULTY`, and `CANTEEN_STAFF`.
  - HTTP-Only secure cookie-based JWT authentication (`token`), shielding against client-side XSS token exfiltration.
  - Model-level `select: false` on `passwordHash` guaranteeing password hashes are never leaked in queries, responses, or logs.
  - Password hashing with `bcryptjs` (salt factor 10) with zero plaintext storage.
  - Public registration restricted to `STUDENT` and `FACULTY`; public role escalation to `CANTEEN_STAFF` rejected with `403 Forbidden`.
  - Generic authentication errors (`"Invalid email or password."`) preventing email enumeration attacks.
  - Inactive user account login prevention (`isActive: false` check).
  - Silent session restoration on app startup via `GET /api/auth/me`.
  - Comprehensive Profile & Account page (`/profile`) supporting name updates and secure password changes requiring `currentPassword` verification.
  - Mass-assignment defense on user profile updates (role, email, isActive, and passwordHash are strictly immutable).
  - Server-side authorization middleware (`protect`, `requireStaff`, `requireRole`) enforcing access across orders and menu management.
  - Customer order privacy isolation (students strictly restricted to their own orders).
  - Security headers with `helmet` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, etc.).
  - Rate limiting on sensitive auth endpoints (`express-rate-limit`: 60 requests per 15 minutes per IP).
  - Clean error handling middleware preventing stack trace and database internal leaks in production.
- **Phase 10: Staff Menu Management + Live Inventory & Availability Control**:
  - Direct canteen authority over menu dishes, subcategories, prep times, and prices via MongoDB single source of truth.
  - High-density operational inventory table with instant search, category filtering, dietary classification, and bulk selection.
  - Fast inline availability toggles (`AVAILABLE`, `SOLD_OUT`, `UNAVAILABLE`) updating in under 50ms without modal friction.
  - Atomic bulk status update operations via `PATCH /api/menu/bulk/availability`.
  - Non-destructive dish archiving (`isArchived: true`) protecting historical order receipts.
  - Comprehensive Add/Edit modal with client & server validation, price checks, and instant image preview with fallbacks.
  - Server-side stale cart price enforcement and sold-out order rejection guards.
- **Phase 09: Staff & Kitchen Operations Dashboard (KDS)**:
  - Dedicated `StaffShell` with dark command slate header (`#0f172a`), live real-time clock, queue counter pill, and mobile drawer.
  - Ergonomic `KitchenOrderTicket` with prominent monospace token (`CB-XXXX`), pickup window, quantity-first items list (`2× Masala Dosa`), and customer notes.
  - 3-Column operational Kanban view (`PENDING` | `PREPARING` | `READY`) with fast scanning and touch-optimized action targets (≥44px).
  - Background queue sync polling every 10 seconds with disconnected state preservation.
  - Strict server-authoritative status transition guards with timestamps (`preparingAt`, `readyAt`, `completedAt`, `cancelledAt`).
  - Staff operational cancellation modal with structured reason tracking.
  - Protected backend routes with `requireStaff` middleware blocking unauthorized students and faculty.
- **Phase 08: Customer Order Tracking & Reorder UX**:
  - Live tracking stepper (`Placed` → `Cooking` → `Ready at Counter #3` → `Completed`).
  - Active vs. Past order segmentation in `OrderHistoryPage`.
  - Instant reorder engine with dynamic catalog price revalidation.
- **Phase 07: Cart, Express Checkout & Perforated Token System**:
  - Sliding food tray drawer and dedicated `/cart` page.
  - Express canteen checkout with time slot calculation and simulated UPI payment.
  - Perforated ticket token generator with monospace display.
- **Phase 01–06: MERN Foundation & Human-Crafted Design System**:
  - Full React + Vite frontend with custom CSS design tokens (no generic frameworks).
  - Express + MongoDB backend with strict server-side price authority and atomic operations.

---

## [1.0.0] - 2026-10-02

### Added
- **Authentication & User Management**:
  - Student and Canteen Staff role-based authentication (`/api/auth/register`, `/api/auth/login`).
  - Session-based user persistence and role redirection.
- **Dynamic Menu Catalog**:
  - Categorized item browsing (Meals & Biryani, Snacks, Beverages & Desserts).
  - Real-time dietary filters (Veg / Non-Veg) and search functionality.
  - Interactive cart management with quantity adjustment and dynamic total calculation.
- **Pre-Order Lifecycle**:
  - Atomic database transactions for placing multi-item orders (`/api/orders`).
  - Scheduled pickup time slots (Immediate, 15m, 30m, 45m, 1h).
  - Order history retrieval by user ID.
- **Admin & Staff Management Panel**:
  - Live stock availability toggling (`/api/menu/availability`).
  - Real-time order status updates (`PENDING` -> `PREPARING` -> `READY_FOR_PICKUP` -> `COMPLETED`).
- **Architecture & Infrastructure**:
  - Jakarta Servlet 6.0 REST API backend with Jackson Databind.
  - Dual-mode runtime: Standalone Java HTTP Server (`Server.java`) and Apache Tomcat 10+ WAR packaging.
  - MySQL 8.0+ transactional database schema with foreign key constraints.
  - Environment variable overrides (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `PORT`).
  - Automated CI workflow with GitHub Actions (JDK 21, Maven).
  - JUnit 5 unit test suite for data models and serialization.

