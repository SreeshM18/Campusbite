# CampusBite — Comprehensive Legacy Migration Analysis

**Project**: CampusBite — Campus Food Pre-Ordering Platform  
**Target Migration**: Java Servlets / Jakarta + MySQL + Vanilla HTML/JS $\rightarrow$ Full MERN Stack (MongoDB, Express.js, React + Vite, Node.js)  
**Date**: October 2026  
**Status**: Pre-Migration Audit Complete

---

## 1. Executive Summary & Existing Architecture

The original **CampusBite** project was structured as a dual-mode Java Web Application intended to streamline campus canteen operations. It consisted of two competing server paradigms:
1. **Standalone JDK HTTP Server (`Server.java`)**: An embedded server bound to port 8080 with in-memory JSON parsing and direct JDBC calls.
2. **Jakarta Servlet & JSP Architecture (`src/main/java/com/canteen/*`)**: Standard Maven WAR deployment targeted at Apache Tomcat using `HttpServlet`, DAO layers, and MySQL connection pooling via `DBConnection.java`.
3. **Vanilla Frontend (`src/main/webapp/`)**: Static HTML5 pages (`index.html`, `login.html`, `register.html`, `admin.html`), custom CSS (`css/style.css`), and JavaScript files (`js/auth.js`, `js/menu.js`, `js/admin.js`) coupled heavily with browser `localStorage`.

```
LEGACY ARCHITECTURE:
[Browser (HTML/CSS/JS)] <---> [localStorage (Auth & Cart & Orders)]
          |                                  |
   (Desynchronized HTTP)           (Simulated Offline State)
          v                                  v
[Java Servlets / Server.java] <---> [MySQL Database (canteen_db)]
```

---

## 2. Legacy Stack & Tech Breakdown

| Layer | Legacy Implementation | Observed Limitations & Debt |
| :--- | :--- | :--- |
| **Backend Runtime** | Java 17+ (Jakarta EE 10 / Tomcat 10) + Embedded JDK HTTP Server | Dual-server fragmentation (`Server.java` vs Servlets); boilerplate-heavy Servlets; manual JSON string concatenation. |
| **Persistence / DB** | MySQL 8.0 (`canteen_db`) via raw JDBC | String-interpolated SQL statements; lack of connection pooling safety; rigid relational joins for nested cart items. |
| **Frontend** | Vanilla HTML5, Vanilla ES6 JS, Custom CSS | State fragmentation between `localStorage` and backend DB; unencrypted client-side credentials; imperative DOM mutations. |
| **Authentication** | Plaintext SQL query `SELECT * FROM users WHERE email=? AND password=?` & `localStorage.setItem('user', ...)` | Critical security flaw: no bcrypt hashing, no JWT/cookie protection, client-side privilege escalation. |
| **Assets & Media** | Local JPEG files in `src/main/webapp/images/` | Hardcoded relative paths in client JS arrays; inconsistent aspect ratios. |

---

## 3. Detailed Page & Flow Audit

### A. Customer Entry & Menu Browsing (`index.html` + `js/menu.js`)
- **Pages/Views**: Hero banner, Category Pills (`All`, `Breakfast`, `Meals`, `Snacks`, `Beverages`, `Desserts`), Veg/Non-Veg filter toggles, live search bar, floating cart drawer, simulated pickup time dropdown, order confirmation modal, live tracker view, customer reviews.
- **Legacy Functionality**:
  - Initialized food items from a hardcoded JavaScript array (`defaultItems`) when backend API was unreachable.
  - Cart stored in `localStorage.getItem('cart')`.
  - Item quantities adjusted via DOM innerHTML reconstruction.
  - Pickup options: `immediate`, `15mins`, `30mins`, `45mins`, `1hour`.
  - Demo payment modal rendered a static ₹100 QR code irrespective of the actual subtotal.

### B. Authentication (`login.html`, `register.html` + `js/auth.js`)
- **Pages/Views**: Split-pane hero authentication cards with tab switching between Student, Faculty, and Staff.
- **Legacy Functionality**:
  - Registration allowed arbitrary role injection (`STUDENT`, `FACULTY`, `ADMIN`/`STAFF`) directly from the frontend dropdown without authorization.
  - Stored user session in `localStorage.setItem('currentUser', JSON.stringify(user))`.
  - Password stored in plaintext across database and client storage.

### C. Staff / Admin Operations (`admin.html` + `js/admin.js`)
- **Pages/Views**: Kitchen Command Center with live order queue, KPI cards (Total Orders, Pending, Preparing, Ready, Completed, Revenue), and Menu Item Management.
- **Legacy Functionality**:
  - Order queue read from `localStorage.getItem('campusbite_orders')` rather than querying MySQL.
  - Menu item updates modified local arrays without persisting to the database.
  - Status progression was purely client-side: `PENDING` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`.

---

## 4. Legacy Database Schema vs Reality

### Schema (`sql/schema.sql`)
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'FACULTY', 'ADMIN') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('BREAKFAST', 'MEALS', 'SNACKS', 'BEVERAGES', 'DESSERTS') NOT NULL,
    food_type ENUM('VEG', 'NON_VEG') DEFAULT 'VEG',
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    prep_time INT DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    pickup_type VARCHAR(50),
    pickup_time VARCHAR(50),
    token_number VARCHAR(20) UNIQUE NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
    payment_method VARCHAR(50) DEFAULT 'UPI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

## 5. Security Vulnerabilities, Inconsistencies & Technical Debt

1. **Plaintext Password Storage & Transport**:
   - `UserDAO.java` and `Server.java` executed raw unhashed password comparisons.
   - Passwords returned directly in JSON payloads and persisted in browser `localStorage`.
2. **Client-Side Authorization Spoofing**:
   - Staff/Admin screens (`admin.html`) were protected only by checking `localStorage.getItem('currentUser')?.role === 'ADMIN'`. Anyone could open DevTools and elevate their privileges.
3. **Price Tampering Vulnerability**:
   - Subtotal was calculated exclusively on the client and accepted by the server without querying authoritative item prices.
4. **Dual State Divergence (LocalStorage vs Database)**:
   - Orders placed on `index.html` were saved to `localStorage` under `campusbite_orders`, while `admin.html` read from `localStorage`. If a user placed an order on another device, the canteen staff never received it.
5. **Static Hardcoded QR Code & Inflexible Demo Payment**:
   - Payment modal generated a hardcoded UPI string for ₹100 regardless of the actual cart total.
6. **Token Collision Risk**:
   - Tokens were generated with `Math.floor(1000 + Math.random() * 9000)` without unique database constraints or collision retry logic.
7. **No Server-Side Input Validation**:
   - Missing sanity checks for negative quantities, empty cart submissions, or nonexistent menu item IDs.

---

## 6. MERN Architecture & Transformation Plan

```
TARGET MERN ARCHITECTURE (Unified Monorepo):
┌─────────────────────────────────────────────────────────────┐
│                 React + Vite Frontend (client/)             │
│  - React Router DOM, AuthContext (JWT Cookies), CartContext │
│  - Modern Food Design System (Semantic CSS Tokens)         │
│  - Customer Portal + Operations Staff Kitchen Command       │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API (credentials: include)
                               v
┌─────────────────────────────────────────────────────────────┐
│               Node.js + Express Server (server/)            │
│  - Middleware: protect, requireStaff, errorHandler, CORS     │
│  - Controllers: authController, menuController, orderCtrl   │
│  - Server-calculated subtotals & Token generation (CB-XXXX) │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               v
┌─────────────────────────────────────────────────────────────┐
│                       MongoDB Database                      │
│  - Collections: users (bcrypt), menuitems, orders           │
└─────────────────────────────────────────────────────────────┘
```

### Migration Deliverables Matrix
- [x] **Audit & Migration Analysis (`MIGRATION_ANALYSIS.md`)**
- [ ] **Express REST Backend (`server/`)**:
  - `User`, `MenuItem`, `Order` Mongoose models with strict schema constraints.
  - JWT in HTTP-Only, SameSite cookies + bcrypt hashing (salt rounds = 10).
  - Robust token generator `CB-XXXX` with database collision mitigation.
  - Real-time seed script with demo credentials and all 12 culinary menu items.
- [ ] **React + Vite Frontend (`client/`)**:
  - Food-centric Warm Editorial design system (Warm Amber, Deep Charcoal, Fresh Herb Green, Crisp Terracotta).
  - Full Customer Experience (Menu browsing, search, category pills, dietary filter, tray drawer, pickup scheduler, demo UPI checkout, order success token ticket, live tracking status, order history).
  - Full Staff Experience (Kitchen Kanban order queue, status progression buttons `PENDING` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`, real-time menu item creation, price updates, and instant out-of-stock toggling).
- [ ] **Legacy Archiving (`legacy/`)**: Safe preservation of legacy Java/JSP files.
- [ ] **Comprehensive Documentation**: `ARCHITECTURE.md`, `DESIGN.md`, `API.md`, `MIGRATION.md`, and updated `README.md`.
