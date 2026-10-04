# CampusBite UX Architecture & Customer Ordering Flows

This document details the complete end-to-end human-crafted interaction design, customer post-order tracking, and transaction architecture for CampusBite.

---

## 1. End-to-End Ordering & Post-Order Lifecycle

```text
[Menu Discovery (/menu)]
       │
       ▼ (Search, Category Pills, Diet Filter, Dietary Badges)
[Add Dishes to Food Tray]
       │
       ▼ (Instant Quantity Stepper: - 1 +, Immediate subtotal calculation)
[Cart Experience (/cart or Tray Drawer)]
       │
       ▼ (Quantity adjustment, Dish removal, Pickup window scheduling)
[Secure Checkout (/checkout)]
       │
       ▼ (Order breakdown review, Special kitchen instructions, Demo payment selection)
[Server Order Creation (POST /api/orders)]
       │
       ▼ (Server recalculates authoritative prices from MongoDB, validates availability, creates order & token)
[Order Confirmation (/orders/:id/success)]
       │
       ▼ (High-contrast perforated token ticket CB-XXXX, single-burst celebration, handover instructions)
[Live Kitchen Order Tracking (/orders/:id)]
       │
       ▼ (4-step visual timeline: PENDING → PREPARING → READY → COMPLETED, 10s smart auto-poll)
[Express Handover at Central Food Court — Counter #3]
       │
       ▼ (Staff marks COMPLETED / Food Collected)
[My Orders & 1-Tap Reorder History (/orders)]
       │
       ▼ (Instant live menu revalidation, price updates, automated cart restore)
[Cycle Repeats Seamlessly]
```

---

## 2. Customer Post-Order Experience (Phase 08)

### 2.1 My Orders Page (`/orders`)
- **Active vs Past Separation**: Active orders (`PENDING`, `PREPARING`, `READY`) are displayed prominently at the top with elevated cards, live status badges, and large monospace token tickets. Past orders (`COMPLETED`, `CANCELLED`) are listed in a compact, scannable format.
- **Filter Tabs**: Instant filtering by `All Orders`, `Active Pickup`, `Completed`, and `Cancelled`.
- **Fast Search**: Instant substring search across tokens (`CB-XXXX`) and dish names.
- **Dynamic Skeletons**: Realistic shimmer loading cards prevent content layout shifting.
- **Contextual Empty States**: Distinct warm empty state for first-time users ("No Orders Yet") vs active order empty notices ("No active orders right now. Ready for a break?").

### 2.2 Active Order Card & Ready Notification
- **High-Contrast Token**: Monospace `CB-XXXX` in perforated ticket badge styled with dashed borders and ticket notches.
- **Ready State Elevation**: When order status reaches `READY`:
  - Card gains emerald accent border and subtle glow.
  - Prominent banner: *"🎉 Ready for Pickup! Flash Token at Counter #3 for instant collection."*
- **Order Cancellation**: Pending orders provide an accessible "Cancel Order" button with a structured reason modal. Once cooking begins (`PREPARING`), cancellation is safely locked out.

### 2.3 Intelligent "Order Again" (Reorder UX)
- **Validation-First Reordering**:
  1. Reads past order dish IDs and quantities.
  2. Queries current `/api/menu` to verify real-time availability and latest prices.
  3. Adds available items to the food tray with authoritative current pricing.
  4. Dispatches clear toast feedback if specific items are sold out (e.g., *"Added available items. Note: 'Chicken Puff' is sold out."*).
  5. Navigates student to `/cart` for review (never bypasses checkout).

---

## 3. Order Status Timeline & Smart Polling

### 3.1 Status Stages & Copy

| Status Key | Badge Text | Stepper Label | Contextual Microcopy |
|:---|:---|:---|:---|
| `PENDING` | Received | Order Received | *"Sent to canteen kitchen. Preparation will begin shortly."* |
| `PREPARING` | Cooking | Cooking & Packing | *"Chef is actively cooking and assembling your tray."* |
| `READY` | Ready at Counter #3 | Ready for Pickup | *"Your food is packed hot! Show token at Counter #3."* |
| `COMPLETED` | Collected | Completed | *"Order collected at canteen counter. Thank you!"* |
| `CANCELLED` | Cancelled | Cancelled | *"This order was cancelled."* |

### 3.2 Smart Polling Engine
- Polling runs every **10 seconds** only while an order is in an active state (`PENDING`, `PREPARING`, `READY`).
- Polling automatically stops as soon as the order reaches a terminal state (`COMPLETED` or `CANCELLED`), preventing server resource exhaustion.
- Manual "Live Refresh" button provides immediate on-demand synchronization.

---

## 4. Pickup Window Scheduling Architecture

| Interval Value | UI Label | Intended Campus Use Case | Target Readiness Formula |
|:---|:---|:---|:---|
| `Immediate` | Immediate (~10–15 mins) | Walking towards food court now | Current Time + Dish Prep Time (min 10 mins) |
| `15` | 15 Minutes | In short 10-min lecture break | Current Time + 15 mins |
| `30` | 30 Minutes | Standard period end / lab conclusion | Current Time + 30 mins |
| `45` | 45 Minutes | Pre-ordering before lunch rush | Current Time + 45 mins |
| `60` | 1 Hour | Morning booking for afternoon meal | Current Time + 60 mins |

---

## 5. Security & Data Integrity Rules
- **Server Price Authority**: Client totals are strictly display-only. The server recalculates subtotals from MongoDB upon order creation.
- **Strict User Ownership**: Endpoints enforce JWT authorization. Students can only retrieve or cancel their own orders (`403 Forbidden` on unauthorized access).
- **Historical Snapshot**: Past orders preserve the item name, price, and quantity as they were at the time of ordering, ensuring receipt accuracy even if menu items are subsequently edited or deleted.

---

## 6. Authentication, Identity, Profile & Session Expiry UX (Phase 11)

### 6.1 Authentication Pages
- **Login (`/login`)**:
  - Direct, distraction-free card with high visual clarity.
  - Show/hide password eye toggle with accessible aria labels.
  - Autocomplete attributes for password managers (`email`, `current-password`).
  - One-click demo fill buttons for quick evaluative testing (Student, Faculty, Staff).
  - Redirect memory: remembers the user's intended route (e.g. `/checkout`) upon successful login.

- **Registration (`/register`)**:
  - Role segment switcher for `Student` vs `Faculty / Staff`.
  - Canteen Staff accounts are clearly labeled as pre-provisioned for institutional security.
  - Clear password validation feedback (minimum 8 characters).

### 6.2 Profile & Account Management (`/profile`)
- **Avatar & Role Badges**: User initials avatar with color-coded role indicators (Orange for Staff, Blue for Faculty, Green for Student).
- **Name Editing**: Inline edit form with instant optimistic state update.
- **Read-Only Email**: Campus email is displayed read-only to preserve account integrity.
- **Password Management**: Dedicated password change card requiring `currentPassword` verification with show/hide visibility toggles.
- **Safe Sign Out**: Explicit one-click logout that clears the HTTP-only cookie and redirects cleanly.

### 6.3 Graceful Session Expiry & Return Paths
- When a 401 Unauthorized occurs on an authenticated route (e.g., checkout session expired):
  1. The student's food tray in `CartContext` remains untouched in memory.
  2. The application redirects to `/login` with location state `{ from: '/checkout' }`.
  3. Upon re-authenticating, the student is seamlessly returned to `/checkout` with their cart intact.

