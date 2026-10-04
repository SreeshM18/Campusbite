# CampusBite — Security & Hardening Architecture

**Version:** 2.0 (MERN Hardened Edition)  
**Last Updated:** Phase 11 Identity & Security Pass  

---

## 1. Threat Model & Principles
CampusBite enforces the golden rule of distributed web applications:
> **The server is the single source of truth for identity, pricing, and authorization.**  
> UI guards provide an intuitive user experience; server middleware provides ironclad security.

---

## 2. Authentication Architecture

### 2.1 Password Security
- **Hashing Algorithm:** `bcryptjs` using adaptive salt generation (cost factor = 10 rounds).
- **Zero Plaintext Storage:** Plaintext passwords, temporary passwords, or raw keys are never written to MongoDB or log outputs.
- **Model-Level Exclusion:** The `passwordHash` field in `User` schema is configured with `select: false`. It is never returned in:
  - Registration responses
  - Login responses
  - Session restoration (`/api/auth/me`)
  - Profile retrieval (`/api/auth/profile`)
  - Order snapshots or logs.

### 2.2 JWT & Session Strategy
- **Token Format:** Signed JSON Web Token (HS256) signed with `JWT_SECRET`.
- **Minimal Payload:** Only contains `id` and `role`. No personally identifiable information (PII) or sensitive state.
- **Token Lifetime:** 7 days (`expiresIn: '7d'`).
- **Transport:** Stored exclusively in secure, **HTTP-Only cookies** (`token`).
  - `httpOnly: true` — completely inaccessible to JavaScript (`document.cookie`), preventing XSS token exfiltration.
  - `sameSite: 'lax'` (development) / `'strict'` (production).
  - `secure: true` in production (enforced over HTTPS).
  - `maxAge`: 7 days matching token expiration.

---

## 3. Role-Based Access Control (RBAC)

### 3.1 Role Hierarchy
CampusBite supports exactly three purposeful campus roles:
1. `STUDENT` — Browse menu, place orders, view personal order history, modify own name/password.
2. `FACULTY` — Same dining capabilities as student with academic priority status.
3. `CANTEEN_STAFF` — Access kitchen queue, modify preparation statuses, manage food catalog, toggle item availability, archive items.

### 3.2 Role Escalation Defense
- **Public Registration Barrier:** Public `POST /api/auth/register` accepts only `STUDENT` and `FACULTY`. Any payload requesting `CANTEEN_STAFF` is rejected with `403 Forbidden`.
- **Internal Staff Provisioning:** Staff accounts are provisioned via secure administrative seeding or protected backend workflows.
- **Mass-Assignment Defense on Profile:** `PATCH /api/auth/profile` exclusively updates the `name` field. Attempts to inject `role`, `isActive`, `passwordHash`, or `email` are safely ignored by strict field whitelisting.

---

## 4. API & Resource Protection Matrix

| Route | Method | Required Role | Authorization Check |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Role restricted to `STUDENT` / `FACULTY` |
| `/api/auth/login` | `POST` | Public | Verifies bcrypt hash & `isActive: true` |
| `/api/auth/me` | `GET` | Authenticated | Decodes JWT cookie, verifies active user |
| `/api/auth/profile` | `PATCH` | Authenticated | Whitelists `name` only |
| `/api/auth/password` | `PATCH` | Authenticated | Requires valid `currentPassword` before hash update |
| `/api/orders` | `POST` | Authenticated | Server recalculates authoritative item prices from DB |
| `/api/orders/my` | `GET` | Authenticated | Scoped to `req.user._id` |
| `/api/orders/:id` | `GET` | Owner / Staff | Verifies `order.user === req.user._id` OR `CANTEEN_STAFF` |
| `/api/orders/:id/cancel`| `PATCH`| Owner / Staff | Verifies ownership and `status === 'PENDING'` |
| `/api/orders/staff/*` | `*` | `CANTEEN_STAFF`| Protected by `requireStaff` middleware |
| `/api/menu` (POST/PATCH/DEL)| `*` | `CANTEEN_STAFF`| Protected by `requireStaff` middleware |

---

## 5. Network & System Hardening

### 5.1 Security Headers (Helmet)
- `X-Content-Type-Options: nosniff` — Blocks MIME-type sniffing.
- `X-Frame-Options: SAMEORIGIN` — Clickjacking protection.
- `X-XSS-Protection` — Browser-level XSS filtering.
- `Strict-Transport-Security` (HSTS in production).

### 5.2 CORS & Origin Whitelisting
- Strict origin verification via `process.env.CLIENT_URL` (with localhost support for development).
- Wildcard origins (`origin: '*'`) are forbidden with `credentials: true`.

### 5.3 Rate Limiting
- `express-rate-limit` active on `/api/auth` (60 requests per 15-minute window per IP) to mitigate brute-force and credential-stuffing attacks.

### 5.4 Input Sanitization & NoSQL Injection Defense
- Normalization of all email inputs (`trim()`, `toLowerCase()`).
- Typed parameter extraction: query objects from users are never spread directly into Mongoose filters.
- Mongoose CastError interception for invalid MongoDB `ObjectId` strings (returns clean 400 Bad Request instead of internal server error traces).

---

## 6. Known Limitations & Roadmap
1. **Demo Payment Flow:** Payment processing simulates an instant UPI transfer without banking webhooks. Real-world deployment will integrate Razorpay/Stripe webhooks with HMAC-SHA256 signature verification.
2. **Email Verification:** Student verification relies on campus email validation; automated SMTP link verification is slated for future release.
