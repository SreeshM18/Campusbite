# CampusBite — Complete Feature & Page Inventory

## 1. Page Mapping & Functional Audit Table

| Page | Path | Target User | Core Components | Data Source | Key User Actions | Major Problems / Defects |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Customer Hub / Menu** | `index.html` | Student, Faculty | Hero banner, Category pills, Dietary filter, Search bar, Food cards, Floating cart drawer, Pickup schedule selector, Checkout modal, Demo UPI popup, Token modal, Live tracker, Review cards | `localStorage` (`bytebite_catalog_v3`, `bytebite_user_cart`) | Filter dishes, add/remove items, set pickup window, submit demo order, track live token | Hardcoded default items; orders saved to `localStorage` instead of DB; simulated UPI modal displays hardcoded ₹100 QR regardless of subtotal. |
| **Sign In** | `login.html` | Student, Faculty, Staff | Email & password form, Demo account 1-click pills (`student`, `staff`), Alert message box | `localStorage` (`canteen_users`) | Input credentials, auto-fill demo accounts, validate against stored JSON | Passwords compared in plaintext; session stored unencrypted in `localStorage` (`canteen_session`); no server session cookies. |
| **Registration** | `register.html` | New Users | Full name, email, role selector (`student`, `faculty`, `staff`), password & confirmation | `localStorage` (`canteen_users`) | Create account, store to localStorage array, redirect to login | Users can arbitrarily register as `CANTEEN_STAFF` directly from dropdown; passwords saved in plaintext; no email verification. |
| **Staff Kitchen Command** | `admin.html` | Canteen Staff | KPI metric cards (Total, Pending, Preparing, Ready, Completed, Revenue), Orders Kanban ticket grid, Status transition buttons, Menu inventory table, Availability toggles | `localStorage` (`canteen_orders`, `bytebite_catalog_v3`) | View incoming queue, advance status (`PENDING` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`), toggle item stock, edit item | Orders only visible if placed on the same device/browser; route protected only by client-side JS check; zero database persistence. |

---

## 2. End-to-End Customer Journey Trace

```text
[User Opens index.html]
        │
        ▼
[Browse Dishes & Categories] ──(Source: localStorage 'bytebite_catalog_v3' / defaultFoodItems array)
        │
        ▼
[Add Dishes to Cart] ──────────(Stored in localStorage 'bytebite_user_cart')
        │
        ▼
[Select Pickup Timing] ────────(Dropdown: immediate, 15mins, 30mins, 45mins, 1hour)
        │
        ▼
[Open Checkout Modal] ─────────(Computes client-side sum: subtotal + taxes)
        │
        ▼
[Simulated UPI Payment] ───────(Displays static ₹100 QR code string regardless of cart total)
        │
        ▼
[Click "Confirm Payment"] ─────(Generates random token Math.floor(1000 + Math.random()*9000))
        │
        ▼
[Order Saved to localStorage] ──(Pushed to localStorage 'canteen_orders')
        │
        ▼
[Token Badge & Live Tracker] ──(Simulates timer-based stage progression on screen)
```

### Identified Journey Breakdowns:
1. **No Cross-Device Sync**: If order is created on student's laptop, canteen staff on kitchen terminal sees 0 orders.
2. **Client Total Tampering**: Client calculates the order total with no backend validation.
3. **Token Collisions**: 4-digit random numbers (`1000-9999`) have no uniqueness guarantee in storage.

---

## 3. End-to-End Staff Kitchen Journey Trace

```text
[Staff Opens admin.html]
        │
        ▼
[Client Auth Guard] ───────────(Checks if localStorage.getItem('canteen_session')?.role === 'CANTEEN_STAFF')
        │
        ▼
[Read Order Queue] ────────────(Reads localStorage.getItem('canteen_orders'))
        │
        ▼
[Auto Polling Loop] ───────────(Executes setInterval(loadOrders, 2500))
        │
        ▼
[Click "Start Preparing"] ─────(Mutates order object status in localStorage array)
        │
        ▼
[Click "Mark Ready"] ──────────(Mutates status to 'READY' in localStorage)
        │
        ▼
[Click "Handed Over"] ─────────(Mutates status to 'COMPLETED' in localStorage)
```

### Identified Staff Breakdowns:
1. **Unprotected Operations**: Any user can type `localStorage.setItem('canteen_session', JSON.stringify({role:'CANTEEN_STAFF'}))` in browser console and gain full admin clearance.
2. **Stock Toggles Are Local**: Toggling an item to "Sold Out" in `admin.html` only affects that single browser instance.
