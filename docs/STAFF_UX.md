# CampusBite Staff / Kitchen Operations UX & Architecture Guide

## 1. Executive Summary & Design Purpose
The CampusBite Staff Interface is an ergonomic, high-density **Kitchen Display System (KDS)** and operational control dashboard engineered specifically for canteen counter managers, line cooks, and pickup fulfillment staff.

Unlike the student-facing storefront—which optimizes for culinary discovery, high-appeal food photography, and frictionless ordering—the staff interface is strictly optimized for **speed, scanning efficiency, error prevention, and touch ergonomics**.

---

## 2. Staff App Shell (`StaffShell`)

### 2.1 Visual Atmosphere & Theme Distinction
- **Command Slate Bar (`#0f172a`)**: A dark, focused navigation and status header that sits stickily above the work surface.
- **Operational Surface (`#f1f5f9`)**: Clean, neutral slate background designed for high ambient lighting and glare reduction in kitchen environments.
- **Header Elements**:
  - **CampusBite Kitchen Badge**: Counter #3 designated indicator with active operational dot.
  - **Live Real-Time Clock**: 12-hour ticking digital clock (`hh:mm:ss A`) for time coordination against pickup deadlines.
  - **Live Queue Counter Pill**: Dynamic counter (`X Active in Queue`) highlighting total workload.
  - **Staff Profile & Quick Logout**: Clear attribution of logged-in staff member without cluttering the screen.
  - **Navigation Links**: Direct switches between *Live Kitchen Queue* (`/staff/orders`) and *Menu & Stock Control* (`/staff/menu`).

---

## 3. Order Queue Architecture & Kanban Layout

### 3.1 3-Column Operational Kanban View (`ACTIVE` Tab)
On desktop and tablet viewports (≥768px), the dashboard arranges active orders into three dedicated linear workflow columns:

1. **Column 1: New Orders (`PENDING`)**
   - Color accent: Amber (`#f59e0b`).
   - Purpose: Ingest newly placed orders awaiting cooking confirmation.
   - Primary Action: `Start Preparing` (`#2563eb`).
2. **Column 2: In Cooking (`PREPARING`)**
   - Color accent: Cobalt Blue (`#2563eb`).
   - Purpose: Tracks items currently being prepared by the kitchen team.
   - Primary Action: `Mark Ready at Counter #3` (`#16a34a`).
3. **Column 3: Ready for Handover (`READY`)**
   - Color accent: Emerald Green (`#16a34a`).
   - Purpose: Orders waiting for customer arrival at the pickup counter.
   - Primary Action: `Complete Handover` (`#334155`).

### 3.2 Specific Filter Tabs
- `All Active`: 3-Column Kanban view for high-level scanning.
- `Pending`: Focused single-grid view for incoming orders.
- `In Cooking`: Focused single-grid view for active line cooks.
- `Ready at Counter`: Focused single-grid view for counter dispatchers.
- `Fulfilled Logs`: Complete historical audit table of completed and cancelled orders.

---

## 4. Kitchen Order Ticket Anatomy (`KitchenOrderTicket`)

Every ticket is designed around an uncompromising information hierarchy:

```
+-------------------------------------------------------------+
| [Priority: Placed 18 mins ago]                              | <- Aging Strip (if >=15m)
+-------------------------------------------------------------+
|  CB-1042                     [ In 15 Mins (~1:30 PM) ]     | <- Monospace Token & Window
|                                                             |
|  👤 Rohan Sharma (Student)               5 min ago          | <- Customer & Order Age
+-------------------------------------------------------------+
|  2×  Masala Dosa                                            | <- Quantity-First Items
|  1×  Cold Coffee                                            |
|  1×  Samosa (2 pcs)                                         |
|                                                             |
|  💬 Note: Extra spicy chutney on the dosa                   | <- Special Instructions
+-------------------------------------------------------------+
|  [  ▶ Start Preparing  ]               [ ✕ Reject ]         | <- >=44px Action Buttons
+-------------------------------------------------------------+
```

### 4.1 Visual Hierarchy Priorities
1. **Token (`CB-XXXX`)**: Rendered in `1.65rem` bold monospace font for effortless distance reading across the counter.
2. **Pickup Window**: Immediate distinction between `ASAP` and scheduled pickup times (e.g. `In 15 Mins`).
3. **Order Age & Priority**: Non-intrusive amber strip automatically highlights orders waiting over 15 minutes to prevent overlooked tickets.
4. **Quantity-First Items**: Formatted with high-contrast pill badges (`2×`, `1×`) so cooks immediately register quantities.
5. **Customer Name & Notes**: Essential customer identification and preparation instructions clearly displayed without modal drill-downs.
6. **One Clear Primary Action**: Large touch target (≥44px) matching the current workflow phase.

---

## 5. Status Transitions & Server Authority

### 5.1 Permitted Transitions Matrix
```
[ PENDING ]   ───►   [ PREPARING ]   ───►   [ READY ]   ───►   [ COMPLETED ]
     │                      │
     └───► [ CANCELLED ] ◄──┘
```

| Current Status | Target Status | Allowed? | Server Action & Timestamp Set |
| :--- | :--- | :--- | :--- |
| `PENDING` | `PREPARING` | **YES** | Updates status to `PREPARING`, sets `preparingAt = Date.now()` |
| `PREPARING` | `READY` | **YES** | Updates status to `READY`, sets `readyAt = Date.now()` |
| `READY` | `COMPLETED` | **YES** | Updates status to `COMPLETED`, sets `completedAt = Date.now()` |
| `PENDING` | `CANCELLED` | **YES** | Sets status to `CANCELLED`, sets `cancelledAt`, saves `cancelReason` |
| `PREPARING` | `CANCELLED` | **YES** | Staff rejection with modal reason, sets `cancelledAt` |
| `PENDING` | `COMPLETED` | **NO (400)** | Rejects illegal skip: Kitchen must prepare and mark ready first |
| `COMPLETED` | `PREPARING` | **NO (400)** | Rejects reopening terminal fulfilled state |

---

## 6. Background Polling & Resilience

- **Polling Interval**: Background sync runs every **10 seconds** without full-page reloads.
- **Connection Error Handling**: If server connectivity is interrupted, the UI preserves the last loaded queue state and renders an amber connection banner with a direct `Retry` action.
- **In-Flight Action Locking**: Primary buttons display a loading spinner and are disabled during network requests to prevent accidental double submissions.

---

## 7. Responsive Breakpoint Strategy

| Viewport Width | Layout Mode | Optimizations |
| :--- | :--- | :--- |
| **1440px – 1920px** | 3-Column Wide Kanban | High density, sticky column headers, max 1600px centered width. |
| **1024px – 1280px** | 3-Column Tablet Grid | Full touch-optimized action buttons (≥44px height), visible live clock. |
| **768px – 1024px** | 2-to-3 Column Adaptive | Tablet landscape/portrait friendly, compact KPI counters. |
| **360px – 430px** | 1-Column Single Stream | Filter tabs switch active column, mobile navigation drawer. |

---

## 8. Role-Based Security & Middleware Protection

1. **Frontend Protection (`<StaffRoute>`)**:
   - Inspects `user.role === 'CANTEEN_STAFF'`.
   - Non-staff users attempting to visit `/staff/*` are automatically redirected to `/login`.
2. **Backend Middleware (`requireStaff`)**:
   - Every staff endpoint (`GET /api/orders/staff/all`, `GET /api/orders/staff/stats`, `PATCH /api/orders/:id/status`, `POST /api/menu`, `DELETE /api/menu/:id`) strictly checks `req.user.role === 'CANTEEN_STAFF'`.
   - Requests from students, faculty, or unauthenticated clients are immediately rejected with `403 Forbidden` / `401 Unauthorized`.

---

## 9. Menu Management & Live Inventory Experience (`/staff/menu`)

### 9.1 High-Density Operational Inventory View
- **Compact Metric KPIs**: Quick scanning of total active dishes, available in-stock items, sold-out items, and hidden items.
- **Fast 1-Click Availability Toggles**: Inline select per table row updates dish stock (`AVAILABLE`, `SOLD_OUT`, `UNAVAILABLE`) in under 50ms without modal drill-downs.
- **Bulk Selection Toolbar**: Allows checking multiple dishes to perform atomic batch status updates (`Mark In Stock`, `Mark Sold Out`, `Hide / Disable`).
- **Comprehensive Add / Edit Food Modal**: Integrated client & server validation for dish title, description, price (₹), primary category, subcategory, dietary classification, prep time, image path with preview, and featured promotions.
- **Non-Destructive Archiving**: Preserves historical customer order snapshots and receipt totals while safely hiding discontinued recipes from the student menu.

