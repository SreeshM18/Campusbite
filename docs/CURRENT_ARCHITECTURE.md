# CampusBite — Current Legacy Architecture & System Audit

**Repository**: CampusBite (Canteen Food Pre-Ordering System)  
**Legacy Technologies**: Java 17+ (Jakarta EE Servlets / Tomcat 10) + JDK HttpServer (`Server.java`) + MySQL 8.0 JDBC + Vanilla HTML5 / Tailwind CSS / Vanilla ES6 JavaScript  
**Audit Date**: October 2026  
**Auditor**: Full-Stack Engineering Team

---

## 1. Physical Directory Tree (Actual Repository State)

```text
campusbite/
├── legacy/
│   ├── Server.java                      # Standalone JDK HttpServer bound to port 8080
│   ├── Server.class                     # Compiled JDK server bytecode
│   ├── pom.xml                          # Maven build file declaring Jakarta Servlet 6.0 & Jackson 2.15
│   ├── MYSQL_SETUP.md                   # Legacy MySQL manual configuration instructions
│   ├── sql/
│   │   └── schema.sql                   # MySQL 8.0 schema (users, menu_items, orders, order_items)
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/canteen/
│           │       ├── config/
│           │       │   └── DBConnection.java     # JDBC DriverManager connection provider
│           │       ├── controller/
│           │       │   ├── AuthController.java   # Servlet mapped to /api/auth/*
│           │       │   ├── MenuController.java   # Servlet mapped to /api/menu/*
│           │       │   └── OrderController.java  # Servlet mapped to /api/orders/*
│           │       ├── dao/
│           │       │   ├── MenuDAO.java          # JDBC queries for menu_items table
│           │       │   ├── OrderDAO.java         # JDBC queries and transactions for orders & order_items
│           │       │   └── UserDAO.java          # Plaintext SQL queries for users table
│           │       ├── filter/
│           │       │   └── AuthFilter.java       # Basic CORS & session gate servlet filter
│           │       └── model/
│           │           ├── MenuItem.java         # POJO for menu_items entity
│           │           ├── Order.java            # POJO for orders entity
│           │           ├── OrderItem.java        # POJO for order_items relational entity
│           │           └── User.java             # POJO for users entity
│           ├── resources/
│           │   └── db.properties                 # MySQL connection URL, user, and password properties
│           └── webapp/
│               ├── _redirects                    # Netlify/Static hosting routing redirects
│               ├── vercel.json                   # Vercel static rewrites to index.html
│               ├── index.html                    # Customer dining portal, menu browsing, cart modal & tracker
│               ├── login.html                    # Customer & staff authentication login form
│               ├── register.html                 # Customer onboarding registration form
│               ├── admin.html                    # Canteen kitchen staff command center & menu management
│               ├── css/
│               │   └── style.css                 # Custom CSS overrides for legacy UI
│               ├── js/
│               │   ├── auth.js                   # Client-side user database, session & role simulation
│               │   ├── menu.js                   # Catalog rendering, cart tray, simulated UPI, order creation
│               │   └── admin.js                  # Staff order queue Kanban, polling & menu management
│               └── images/                       # 14 Food and background photography assets
├── render.yaml                          # Render deployment spec (Configured as staticPublishPath: src/main/webapp)
├── .env.example
├── .gitignore
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── SECURITY.md
```

---

## 2. Identified Tech Stack & Execution Runtime

| Layer | Declared Technology | Runtime Behavior & Actual Implementation |
| :--- | :--- | :--- |
| **Backend Runtime #1** | Standalone Java Server | `Server.java` using `com.sun.net.httpserver.HttpServer` listening on port `8080`, performing raw JDBC `DriverManager.getConnection()` queries on `users` table. |
| **Backend Runtime #2** | Jakarta Servlets / WAR | Maven-built Tomcat WAR deploying `AuthController`, `MenuController`, and `OrderController` at `/api/*`. |
| **Frontend Runtime** | Vanilla Static Web | HTML5, Tailwind CSS via CDN script (`cdn.tailwindcss.com`), FontAwesome 6 icons (`cdnjs`), custom Web Audio synthesizer, Vanilla JS. |
| **Database** | MySQL 8.0 (`canteen_db`) | 4 Relational Tables (`users`, `menu_items`, `orders`, `order_items`) populated via `schema.sql`. |
| **State Storage** | Browser `localStorage` | All dynamic customer orders, active cart items, registered users, and menu availability were handled entirely inside `localStorage` rather than through backend HTTP calls. |
| **Cloud Deployment** | Render (`render.yaml`) | **Critical Disconnect**: `render.yaml` declares `runtime: static` pointing to `src/main/webapp`, completely discarding the Java backend and MySQL database during deployment. |

---

## 3. Major Architectural Fractures & Technical Debt

```
LEGACY SYSTEM DUALITY:
┌────────────────────────────────────────────────────────┐
│               Browser (HTML5/Tailwind/JS)              │
│  - Reads/Writes to localStorage ('canteen_orders')     │
│  - Authenticates against localStorage ('canteen_users')│
└───────────────────────────┬────────────────────────────┘
                            │ (No API communication)
                            v
┌────────────────────────────────────────────────────────┐
│             Java Servlets & MySQL Database             │
│  - Exists in codebase but completely bypassed in UI   │
│  - Plaintext password checks in UserDAO.java           │
│  - Never received customer orders from web clients     │
└────────────────────────────────────────────────────────┘
```

1. **Complete Frontend / Backend Disconnect**:
   - `menu.js` initialized dishes from `defaultFoodItems` and saved orders to `localStorage.getItem('canteen_orders')`.
   - `admin.js` polled `localStorage.getItem('canteen_orders')`.
   - `OrderController.java` and `OrderDAO.java` exposed `/api/orders`, but the frontend never invoked `fetch('/api/orders')`.
2. **Dual Server Implementation**:
   - The repo contained both a servlet-based architecture (`AuthController.java`, `MenuController.java`, `OrderController.java` under Jakarta EE) and a standalone JDK server (`Server.java`).
3. **Storage Fragmentation**:
   - If a student opened CampusBite on a mobile phone and canteen staff opened it on a tablet, the staff member could never see the student's order because data lived exclusively in the student's private mobile `localStorage`.
