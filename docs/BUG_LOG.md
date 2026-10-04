# CampusBite — Defect & Bug Log (`docs/BUG_LOG.md`)

**Version:** 2.0 (MERN Modernization)  
**Phase:** 12 Full-System QA & Hardening  

---

## Severity Classification
- **BLOCKER**: Prevents fundamental user journey; no workaround available.
- **CRITICAL**: Significant workflow disruption or security vulnerability.
- **HIGH**: Non-blocking malfunction in core features.
- **MEDIUM**: Secondary feature inconsistency or edge-case defect.
- **LOW**: Minor UI/UX discrepancy or microcopy irregularity.
- **COSMETIC**: 1px visual alignment, color token refinement, spacing.

---

## 1. Resolved Defects & Verification Log

### `BUG-01`
- **Area:** Authentication & Model Layer
- **Severity:** CRITICAL
- **Description:** Password hash could potentially be included in user JSON serialization if `toSafeObject()` was not called.
- **Reproduction:** Call `User.find()` or `User.create()` and return directly via `res.json()`.
- **Root Cause:** Schema field lacked database model-level query suppression.
- **Fix:** Applied `select: false` to `passwordHash` in `User.js` schema and added a JSON transform deleting `passwordHash`.
- **Retest:** Verified in `test_phase11.js` (Test 1.1, 2.1, 2.6) and `test_phase12_e2e.js` (Test 1.1).
- **Status:** **FIXED & VERIFIED**

---

### `BUG-02`
- **Area:** Public Registration & RBAC
- **Severity:** CRITICAL
- **Description:** Public registration endpoint allowed role escalation if a client sent `role: 'CANTEEN_STAFF'`.
- **Reproduction:** `POST /api/auth/register` with `{"role": "CANTEEN_STAFF"}`.
- **Root Cause:** Lack of role whitelist check in registration controller.
- **Fix:** Added server-side role check rejecting `CANTEEN_STAFF` with `403 Forbidden` and restricting allowed public roles to `STUDENT` and `FACULTY`.
- **Retest:** Verified in `test_phase11.js` (Test 1.3) and `test_phase12_e2e.js` (Test 6.2).
- **Status:** **FIXED & VERIFIED**

---

### `BUG-03`
- **Area:** Profile Mass-Assignment
- **Severity:** HIGH
- **Description:** Direct spreading of update payloads could allow unauthorized email/role alterations.
- **Reproduction:** `PATCH /api/auth/profile` with `{"role": "CANTEEN_STAFF", "email": "hacked@evil.com"}`.
- **Root Cause:** Updating model properties without whitelist filtering.
- **Fix:** `updateProfile` controller strictly whitelists `user.name = name.trim()` and ignores all other payload fields.
- **Retest:** Verified in `test_phase11.js` (Test 3.2) and `test_phase12_e2e.js` (Test 1.3).
- **Status:** **FIXED & VERIFIED**

---

### `BUG-04`
- **Area:** Menu Management & Order Integrity
- **Severity:** HIGH
- **Description:** Deleted dishes would cause null reference crashes when rendering historical order receipts.
- **Reproduction:** Delete menu item that exists in an older order, then load `/orders/:id`.
- **Root Cause:** Hard deletion removed MongoDB document referenced by historical orders.
- **Fix:** Implemented non-destructive archiving (`isArchived: true`) and snapshotted item name & price inside the `Order.items` array at order placement time.
- **Retest:** Verified in `test_phase10.js` (Test 9) and `test_phase12_e2e.js` (Test 5.5).
- **Status:** **FIXED & VERIFIED**

---

### `BUG-05`
- **Area:** Frontend Accessibility & Motion
- **Severity:** MEDIUM
- **Description:** Users with `prefers-reduced-motion: reduce` experienced animations across drawers and modals.
- **Reproduction:** Enable reduced-motion in OS/Browser settings and interact with modals.
- **Root Cause:** Missing CSS media query for `prefers-reduced-motion`.
- **Fix:** Added `@media (prefers-reduced-motion: reduce)` rule overriding animation and transition durations to 0.01ms in `index.css`.
- **Retest:** Inspected in `client/src/styles/index.css`.
- **Status:** **FIXED & VERIFIED**

---

## 2. Defect Summary Table

| Defect ID | Area | Severity | Resolution Summary | Current Status |
| :--- | :--- | :--- | :--- | :--- |
| `BUG-01` | Auth / User Schema | **CRITICAL** | `select: false` on passwordHash + JSON serializer transform | **FIXED** |
| `BUG-02` | Public Registration | **CRITICAL** | Strict server rejection of `CANTEEN_STAFF` public registration | **FIXED** |
| `BUG-03` | Profile Management | **HIGH** | Strict whitelist update of `name` only | **FIXED** |
| `BUG-04` | Order & Menu Schema | **HIGH** | Snapshot prices at order time + non-destructive dish archiving | **FIXED** |
| `BUG-05` | Frontend CSS | **MEDIUM** | Added `prefers-reduced-motion` and `:focus-visible` styles | **FIXED** |

---

## 3. Zero-Blocker Audit Status
- **Blocker Bugs Open:** 0
- **Critical Bugs Open:** 0
- **High Severity Bugs Open:** 0
- **Medium Severity Bugs Open:** 0
- **Status:** **READY FOR RELEASE GATE**
