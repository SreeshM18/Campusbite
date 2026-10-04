# CampusBite — QA Master Plan & Verification Matrix

**Phase:** 12 (Full-System QA + Accessibility + Performance + Security)  
**Version:** 2.0 (MERN Hardened Edition)  
**Status:** In Execution  

---

## 1. QA Strategy & Scope
This QA Master Plan systematically validates all user journeys, administrative capabilities, network resilience states, and security boundaries across the entire CampusBite ecosystem.

### Test Verdict Tracking
- **PASS**: Meets specification and behavioral acceptance criteria.
- **FAIL**: Deviates from specification or causes an unhandled error.
- **BLOCKED**: Cannot be tested due to prerequisite dependency failure.
- **FIXED**: Defect resolved and patched in codebase.
- **RETESTED**: Re-verified following fix.

---

## 2. Test Suite Matrix

### Suite A: Authentication & Identity
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `AUTH-01` | Valid Student Registration | 201 Created, HTTP-only cookie set, safe user object returned | **PASS** |
| `AUTH-02` | Valid Faculty Registration | 201 Created with `FACULTY` role assigned | **PASS** |
| `AUTH-03` | Role Escalation Block (Public Staff Register) | 403 Forbidden, no database record created | **PASS** |
| `AUTH-04` | Duplicate Email Registration | 409 Conflict with clear user-friendly error message | **PASS** |
| `AUTH-05` | Weak Password / Malformed Inputs | 400 Bad Request with field-level validation errors | **PASS** |
| `AUTH-06` | Valid Login (Student / Faculty / Staff) | 200 OK, sets secure HTTP-only cookie | **PASS** |
| `AUTH-07` | Login with Incorrect Password | Generic 401 Unauthorized (`"Invalid email or password."`) | **PASS** |
| `AUTH-08` | Login with Non-Existent Email | Identical 401 Unauthorized (Prevents user enumeration) | **PASS** |
| `AUTH-09` | Inactive Account Login Block | 401 Unauthorized | **PASS** |
| `AUTH-10` | Session Restoration (`GET /api/auth/me`) | 200 OK with authenticated user profile from cookie | **PASS** |
| `AUTH-11` | Unauthenticated Request to `/me` | 401 Unauthorized | **PASS** |
| `AUTH-12` | Logout & Cookie Invalidation | 200 OK, cookie expired to `1970-01-01` | **PASS** |

### Suite B: Profile & Account Security
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `PROF-01` | Profile Name Update | 200 OK, name updated in database and state | **PASS** |
| `PROF-02` | Mass-Assignment Protection | Role, email, isActive, passwordHash cannot be altered via profile endpoint | **PASS** |
| `PROF-03` | Password Change (Valid Current Password) | 200 OK, new password hashed, old password fails login | **PASS** |
| `PROF-04` | Password Change (Invalid Current Password) | 400 Bad Request (`"Current password does not match"`) | **PASS** |
| `PROF-05` | Password Change (< 8 characters) | 400 Bad Request (`"at least 8 characters"`) | **PASS** |

### Suite C: Menu Discovery & Filtering
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `MENU-01` | Catalog Loading (`GET /api/menu`) | 200 OK, returns active dishes with image, price, dietary tags | **PASS** |
| `MENU-02` | Search Queries (dosa, coffee, biryani, uppercase, lowercase, whitespace) | Instant filtered list matching search keyword | **PASS** |
| `MENU-03` | Special Character / Extreme Search Queries | Gracefully handles without crash, shows warm empty state | **PASS** |
| `MENU-04` | Category Filtering (`BREAKFAST`, `MEALS`, `SNACKS`, etc.) | Accurate subset returned | **PASS** |
| `MENU-05` | Dietary Switch (`VEG` / `NON_VEG`) | Correctly isolates vegetarian and non-vegetarian dishes | **PASS** |
| `MENU-06` | Combined Filter (Veg + Snacks + "paneer") | Intersection filter matches exactly | **PASS** |
| `MENU-07` | Sold-Out Items Display | Displayed with "Sold Out" badge; "Add to Tray" button disabled | **PASS** |
| `MENU-08` | Archived Dish Exclusion | Archived dishes (`isArchived: true`) strictly hidden from customer API | **PASS** |

### Suite D: Cart & Tray Experience
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `CART-01` | Add Single / Multiple Items | Tray badge updates with total count; items displayed accurately | **PASS** |
| `CART-02` | Quantity Increment / Decrement | Stepper updates quantity and subtotal immediately | **PASS** |
| `CART-03` | Remove Item from Tray | Item removed; subtotal recalculates | **PASS** |
| `CART-04` | Sold-Out Guard on Add | Client prevents adding sold-out dish to tray | **PASS** |
| `CART-05` | Stale Price Checkout Defense | Server calculates subtotal from DB prices, ignoring client manipulations | **PASS** |
| `CART-06` | Stale Sold-Out Checkout Defense | Server rejects order if an item in cart became sold out before checkout | **PASS** |

### Suite E: Checkout, Pickup & Payment
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `CHK-01` | Direct Checkout with Empty Tray | Redirects to `/menu` or displays empty tray guidance | **PASS** |
| `CHK-02` | Unauthenticated Checkout Attempt | Redirects to `/login` with `{ from: '/checkout' }`; preserves tray in memory | **PASS** |
| `CHK-03` | Pickup Window Selection (Immediate, 15m, 30m, 45m, 1h) | Selected pickup window recorded accurately in order payload | **PASS** |
| `CHK-04` | Demo Payment Simulation | Honest demo notice displayed; dynamic QR matches exact order total | **PASS** |
| `CHK-05` | Double-Submit Lockout | Submit button enters loading state and disables repeated clicks | **PASS** |

### Suite F: Order Lifecycle, Tokens & History
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `ORD-01` | Server Order Creation & Token | 201 Created; unique monospace token `CB-XXXX` generated | **PASS** |
| `ORD-02` | Order Confirmation Screen (`/orders/:id/success`) | Displays perforated digital ticket with pickup instructions | **PASS** |
| `ORD-03` | Active Order Tracking (`/orders/:id`) | 4-step timeline (`PENDING` → `PREPARING` → `READY` → `COMPLETED`) | **PASS** |
| `ORD-04` | Smart Polling Engine | Polls every 10s on active orders; stops when `COMPLETED` or `CANCELLED` | **PASS** |
| `ORD-05` | Order Cancellation (Pending Only) | Student can cancel before kitchen starts cooking; locked once cooking | **PASS** |
| `ORD-06` | Order History (`/orders`) | Segmented into Active Orders and Past Orders | **PASS** |
| `ORD-07` | Order Privacy & Ownership IDOR Guard | Student B cannot view Student A's order (403 Forbidden) | **PASS** |
| `ORD-08` | 1-Tap Reorder UX | Revalidates live menu prices and availability before tray restore | **PASS** |

### Suite G: Kitchen Operations Dashboard
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `KDS-01` | Staff Route Access (`/staff/orders`) | Staff permitted; Student/Faculty blocked and redirected | **PASS** |
| `KDS-02` | Real-Time Operational Kanban | Columns for `PENDING`, `PREPARING`, `READY` with high-contrast tokens | **PASS** |
| `KDS-03` | Valid Status Progression | `PENDING` → `PREPARING` → `READY` → `COMPLETED` records timestamps | **PASS** |
| `KDS-04` | Invalid Status Reversion Guard | Rejects invalid regressions (e.g. `COMPLETED` → `PREPARING`) | **PASS** |
| `KDS-05` | Token Fast Search | Instant filtering by token number in kitchen queue | **PASS** |

### Suite H: Menu Management & Catalog Administration
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `MGT-01` | Staff Menu Management Access | Protected by `requireStaff` middleware | **PASS** |
| `MGT-02` | Create New Dish | 201 Created with full validation; immediately available in customer menu | **PASS** |
| `MGT-03` | Edit Dish & Authoritative Pricing | Updates live prices across catalog without breaking historical receipts | **PASS** |
| `MGT-04` | Inline Stock Toggle (`AVAILABLE` / `SOLD_OUT`) | Updates under 50ms; customer UI reflects sold out immediately | **PASS** |
| `MGT-05` | Bulk Stock Updates | Atomically updates multiple items in single operation | **PASS** |
| `MGT-06` | Non-Destructive Dish Archiving | Hides dish from customer menu while preserving past order relations | **PASS** |

### Suite I: Security, Network & System Hardening
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `SEC-01` | Helmet Security Headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` active | **PASS** |
| `SEC-02` | CORS Origin Restriction | Restricted to `CLIENT_URL` with credentials enabled | **PASS** |
| `SEC-03` | Rate Limiting on Auth | Blocks brute force attempts after window threshold | **PASS** |
| `SEC-04` | NoSQL Injection & CastError Defense | Malformed MongoDB IDs return clean 400/404 without crashing | **PASS** |
| `SEC-05` | Secret Scanner Audit | Zero production keys or passwords in Git or frontend source code | **PASS** |

### Suite J: Accessibility, Responsiveness & UX Polish
| Test ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| `A11Y-01` | Full Keyboard Navigation | Tab traversal, Enter/Space activation, Esc modal dismiss | **PASS** |
| `A11Y-02` | Visible Focus Rings | High-contrast focus indicator across all interactive controls | **PASS** |
| `A11Y-03` | Accessible Form Labels & Errors | Inputs mapped to explicit `<label>` elements; inline error associations | **PASS** |
| `A11Y-04` | Color Contrast Ratios | WCAG 2.1 AA compliant text contrast ratios | **PASS** |
| `A11Y-05` | Touch Targets | Mobile controls comply with minimum 44×44px hit area standard | **PASS** |
| `RESP-01` | Responsive Viewports | Flawless layouts across 360px, 390px, 430px, 768px, 1024px, 1440px, 1920px | **PASS** |
| `UX-01` | Terminology & Currency Consistency | Unified `"Canteen Staff"`, `"₹"`, `"CB-XXXX"` and time formatting | **PASS** |
