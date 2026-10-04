# CampusBite Database Documentation

The system uses **MySQL 8.0+** with the InnoDB storage engine, leveraging foreign keys and ACID transactional integrity for financial and inventory transactions.

---

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : "referenced in"

    USERS {
        int user_id PK "AUTO_INCREMENT"
        varchar name "100 NOT NULL"
        varchar email "255 UNIQUE NOT NULL"
        varchar password "255 NOT NULL"
        varchar role "STUDENT | CANTEEN_STAFF"
        timestamp created_at "CURRENT_TIMESTAMP"
    }

    MENU_ITEMS {
        int item_id PK "AUTO_INCREMENT"
        varchar name "150 NOT NULL"
        varchar category "100 NOT NULL"
        decimal price "10,2 NOT NULL"
        boolean is_available "DEFAULT TRUE"
    }

    ORDERS {
        int order_id PK "AUTO_INCREMENT"
        int user_id FK "REFERENCES users(user_id)"
        decimal total_amount "10,2 NOT NULL"
        varchar status "PENDING, PREPARING, READY_FOR_PICKUP, COMPLETED"
        varchar pickup_time "50 NOT NULL"
        timestamp created_at "CURRENT_TIMESTAMP"
    }

    ORDER_ITEMS {
        int order_item_id PK "AUTO_INCREMENT"
        int order_id FK "REFERENCES orders(order_id)"
        int item_id FK "REFERENCES menu_items(item_id)"
        int quantity "NOT NULL"
        decimal price "10,2 NOT NULL"
    }
```

---

## 2. Table Specifications

### `users`
Stores student and staff credentials with role-based access flags.

### `menu_items`
Stores the active canteen menu, pricing, category classification, and live availability status.

### `orders`
Header table for each pre-order with status tracking (`PENDING`, `PREPARING`, `READY_FOR_PICKUP`, `COMPLETED`, `CANCELLED`) and targeted pickup time.

### `order_items`
Line item details for each order, capturing frozen price-at-order and quantity.

---

## 3. Database Initialization

Execute the schema script located in `sql/schema.sql`:

```bash
mysql -u root -p < sql/schema.sql
```
