# CampusBite — Security Vulnerability Audit & Defense-in-Depth Specification

**Audit Scope**: Legacy Java + Vanilla JS Application vs Modern MERN Standards  
**Severity Rating Scale**: CRITICAL | HIGH | MEDIUM | LOW

---

## 1. Vulnerability Matrix & Findings

| # | Vulnerability Description | Severity | Legacy Location | Exploitation Impact | MERN Remediation & Defense |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **Plaintext Passwords in DB & Storage** | **CRITICAL** | `UserDAO.java:18`, `Server.java:160`, `auth.js:36` | Database leak or XSS exposes all user passwords instantly in plaintext. | Implemented `bcryptjs` with 10 salt rounds. Passwords are never stored in plaintext and are stripped from all API outputs via Mongoose `toJSON` transforms. |
| **SEC-02** | **Client-Side Role Escalation** | **CRITICAL** | `register.html:42`, `auth.js:68` | Anyone registering could select `staff` from the dropdown and gain full canteen kitchen operational control. | Registration strictly restricts public signups to `STUDENT` or `FACULTY`. Staff accounts cannot be registered publicly and must be seeded or admin-created. |
| **SEC-03** | **Unprotected Backend Staff APIs** | **CRITICAL** | `OrderController.java:58`, `MenuController.java:42` | Any unauthenticated HTTP client could send `PUT /api/orders/status` or `PUT /api/menu/availability` to modify live canteen operations. | Server-side `requireStaff` middleware checks authenticated JWT role (`req.user.role === 'CANTEEN_STAFF'`). Returns `403 Forbidden` if unauthorized. |
| **SEC-04** | **Insecure Direct Object Reference (IDOR)** | **HIGH** | `OrderController.java:24` | `GET /api/orders?userId=X` allowed any user to view any other student's complete order history by changing the `userId` query parameter. | `GET /api/orders/my` extracts the authenticated user ID strictly from the verified JWT session (`req.user._id`). Users cannot inspect other accounts. |
| **SEC-05** | **Client-Side Price Tampering** | **HIGH** | `OrderController.java:47`, `menu.js:909` | Client calculated order total in JavaScript; attacker could modify POST body to pay ₹1 for a ₹200 meal. | **Authoritative Server Recalculation**: Server receives only MenuItem IDs and quantities, queries MongoDB for official prices, and calculates subtotal on backend. |
| **SEC-06** | **Session Hijacking via LocalStorage** | **HIGH** | `auth.js:142`, `admin.js:57` | Storing session objects in `localStorage` is vulnerable to malicious browser scripts and XSS token exfiltration. | Session JWT signed on server and stored in **HTTP-Only, SameSite=Lax, Secure** cookies, inaccessible to client-side JavaScript. |
| **SEC-07** | **Arbitrary Order Status Transitions** | **MEDIUM** | `OrderController.java:72` | Allowed kitchen state to jump illegally (e.g. `COMPLETED` $\rightarrow$ `PENDING` or `PENDING` $\rightarrow$ `COMPLETED`). | Enforced finite state machine transition table: $\text{PENDING} \rightarrow \text{PREPARING} \rightarrow \text{READY} \rightarrow \text{COMPLETED}$. |
| **SEC-08** | **Token Collision Vulnerability** | **MEDIUM** | `menu.js:903` | Tokens generated with `Math.floor(1000 + Math.random()*9000)` without unique DB constraint. | Server-side collision retry generator combined with a unique MongoDB sparse index on the `token` field (`CB-XXXX`). |

---

## 2. Target Security Architecture & Middleware Pipeline

```text
Incoming HTTP Request
       │
       ▼
[CORS Middleware] ──────── (Restricts Origin to CLIENT_URL, withCredentials: true)
       │
       ▼
[Cookie Parser] ────────── (Extracts req.cookies.token)
       │
       ▼
[protect Middleware] ───── (Verifies JWT signature, loads req.user from MongoDB, strips passwordHash)
       │
       ▼
[requireStaff Guard] ──── (Verifies req.user.role === 'CANTEEN_STAFF' for operational routes)
       │
       ▼
[Input Sanitation] ─────── (Validates quantities > 0, checks item availability, sanitizes notes)
       │
       ▼
[Controller Handler]
```
