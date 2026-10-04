# CampusBite Architecture Documentation

This document describes the high-level architecture, module decomposition, and data flow of the **CampusBite - Canteen Pre-Order System**.

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client["Client Tier (Browser)"]
        UI["Web UI (HTML5 / Tailwind CSS / Vanilla JS)"]
        Pages["Pages: index.html, login.html, register.html, admin.html"]
        Storage["Client Storage (localStorage / Sessions)"]
    end

    subgraph Runtime["Application Server Tier"]
        direction TB
        Filter["AuthFilter (Encoding, CORS, Preprocessing)"]
        
        subgraph Controllers["REST Controllers (Jakarta Servlet 6.0)"]
            AuthCtrl["AuthController (/api/auth/*)"]
            MenuCtrl["MenuController (/api/menu/*)"]
            OrderCtrl["OrderController (/api/orders/*)"]
        end

        subgraph DAO["Data Access Layer (JDBC)"]
            UserDAO["UserDAO"]
            MenuDAO["MenuDAO"]
            OrderDAO["OrderDAO (Transaction Managed)"]
        end

        DBConn["DBConnection Pool / Config"]
    end

    subgraph Database["Data Tier (MySQL 8.0+)"]
        T_Users[("users")]
        T_Menu[("menu_items")]
        T_Orders[("orders")]
        T_Items[("order_items")]
    end

    UI -->|HTTP / JSON REST API| Filter
    Filter --> Controllers
    AuthCtrl --> UserDAO
    MenuCtrl --> MenuDAO
    OrderCtrl --> OrderDAO
    
    UserDAO --> DBConn
    MenuDAO --> DBConn
    OrderDAO --> DBConn
    
    DBConn --> T_Users
    DBConn --> T_Menu
    DBConn --> T_Orders
    DBConn --> T_Items
```

---

## 2. Order Placement & Transaction Lifecycle

When a student submits an order, the system executes an atomic database transaction:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Web Client)
    participant Servlet as OrderController
    participant DAO as OrderDAO
    participant DB as MySQL Database

    Student->>Servlet: POST /api/orders (JSON payload with items, pickup time)
    Servlet->>DAO: placeOrder(Order order)
    DAO->>DB: BEGIN TRANSACTION (autoCommit=false)
    DAO->>DB: INSERT INTO orders (...) -> get generated order_id
    loop For each item in order
        DAO->>DB: INSERT INTO order_items (order_id, item_id, quantity, price)
    end
    DAO->>DB: COMMIT TRANSACTION
    DB-->>DAO: Success
    DAO-->>Servlet: true
    Servlet-->>Student: 201 Created {"success": true, "message": "Pre-order placed successfully!"}
```

---

## 3. Dual Execution Modes

CampusBite supports two flexible deployment and execution paradigms:

1. **Standalone Development Mode (`Server.java`)**:
   - Uses Java's lightweight built-in HTTP server (`com.sun.net.httpserver.HttpServer`).
   - Serves static web assets and handles login/registration endpoints directly on port 8080 without requiring an external container.
   
2. **Production Enterprise Container (`WAR` / Tomcat 10+)**:
   - Built using Maven standard WAR packaging (`canteen-preorder-system.war`).
   - Runs in Apache Tomcat 10+ using standard Jakarta EE 10 / Servlet 6.0 annotations (`@WebServlet`, `@WebFilter`).
