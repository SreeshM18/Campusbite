# CampusBite — Relational Database Analysis & MongoDB Mapping

## 1. Legacy MySQL Relational Schema (`canteen_db`)

```text
┌─────────────────────────┐           1:N           ┌─────────────────────────┐
│          users          ├─────────────────────────┤         orders          │
├─────────────────────────┤                         ├─────────────────────────┤
│ PK: user_id (INT)       │                         │ PK: order_id (INT)      │
│ name: VARCHAR(100)      │                         │ FK: user_id (INT)       │
│ email: VARCHAR(255) UQ  │                         │ total_amount: DEC(10,2) │
│ password: VARCHAR(255)  │                         │ status: VARCHAR(30)     │
│ role: VARCHAR(30)       │                         │ pickup_time: VARCHAR(50)│
│ created_at: TIMESTAMP   │                         │ created_at: TIMESTAMP   │
└─────────────────────────┘                         └────────────┬────────────┘
                                                                 │ 1:N
                                                                 ▼
┌─────────────────────────┐           1:N           ┌─────────────────────────┐
│       menu_items        ├─────────────────────────┤       order_items       │
├─────────────────────────┤                         ├─────────────────────────┤
│ PK: item_id (INT)       │                         │ PK: order_item_id (INT) │
│ name: VARCHAR(150)      │                         │ FK: order_id (INT)      │
│ category: VARCHAR(100)  │                         │ FK: item_id (INT)       │
│ price: DECIMAL(10,2)    │                         │ quantity: INT           │
│ is_available: BOOLEAN   │                         │ price: DECIMAL(10,2)    │
└─────────────────────────┘                         └─────────────────────────┘
```

### Table Definitions & Integrity Constraints
1. **`users` Table**:
   - `user_id`: Primary Key (`INT AUTO_INCREMENT`).
   - `email`: `VARCHAR(255) NOT NULL UNIQUE`.
   - `password`: `VARCHAR(255) NOT NULL` (stored in plaintext).
   - `role`: `VARCHAR(30) DEFAULT 'STUDENT'`.
2. **`menu_items` Table**:
   - `item_id`: Primary Key (`INT AUTO_INCREMENT`).
   - `name`: `VARCHAR(150) NOT NULL`.
   - `category`: `VARCHAR(100) NOT NULL`.
   - `price`: `DECIMAL(10,2) NOT NULL`.
   - `is_available`: `BOOLEAN DEFAULT TRUE`.
3. **`orders` Table**:
   - `order_id`: Primary Key (`INT AUTO_INCREMENT`).
   - `user_id`: Foreign Key referencing `users(user_id)` with `ON DELETE RESTRICT`.
   - `total_amount`: `DECIMAL(10,2) NOT NULL`.
   - `status`: `VARCHAR(30) DEFAULT 'PENDING'`.
   - `pickup_time`: `VARCHAR(50) NOT NULL`.
4. **`order_items` Table**:
   - `order_item_id`: Primary Key (`INT AUTO_INCREMENT`).
   - `order_id`: Foreign Key referencing `orders(order_id)` with `ON DELETE CASCADE`.
   - `item_id`: Foreign Key referencing `menu_items(item_id)` with `ON DELETE RESTRICT`.
   - `quantity`: `INT NOT NULL`.
   - `price`: `DECIMAL(10,2) NOT NULL`.

---

## 2. MongoDB Document Modeling & Migration Strategy

In MongoDB, relational joins between `orders` and `order_items` are replaced with a high-performance **Embedded Document Pattern**, while preserving authoritative references to `MenuItem` and `User`.

```text
┌───────────────────────────────────────────────────────────────┐
│                        User Document                          │
│  - _id: ObjectId                                              │
│  - name: String                                               │
│  - email: String (Indexed, Unique, Lowercase)                 │
│  - passwordHash: String (bcrypt)                              │
│  - role: Enum ['STUDENT', 'FACULTY', 'CANTEEN_STAFF']         │
│  - timestamps: { createdAt, updatedAt }                       │
└──────────────────────────────┬────────────────────────────────┘
                               │ 1:N Referenced (Owner)
                               v
┌───────────────────────────────────────────────────────────────┐
│                        Order Document                         │
│  - _id: ObjectId                                              │
│  - user: ObjectId (Ref -> User)                               │
│  - token: String (Unique, Indexed, e.g. "CB-1042")            │
│  - status: Enum ['PENDING', 'PREPARING', 'READY', 'COMPLETED']│
│  - subtotal: Number (Server-calculated)                       │
│  - pickupType: String ("immediate", "15mins", "30mins", etc.) │
│  - pickupTime: String (Formatted pickup window label)         │
│  - paymentStatus: Enum ['PENDING', 'PAID', 'FAILED']          │
│  - paymentMethod: Enum ['UPI', 'CARD', 'CASH_AT_COUNTER']     │
│  - specialInstructions: String                                │
│  - items: [  <-- EMBEDDED SUBDOCUMENTS                       │
│      {                                                        │
│        menuItem: ObjectId (Ref -> MenuItem),                  │
│        name: String (Historical snapshot),                    │
│        price: Number (Authoritative snapshot at order time),  │
│        quantity: Number                                       │
│      }                                                        │
│    ]                                                          │
│  - timestamps: { createdAt, updatedAt }                       │
└──────────────────────────────┬────────────────────────────────┘
                               │ Items Reference
                               v
┌───────────────────────────────────────────────────────────────┐
│                      MenuItem Document                        │
│  - _id: ObjectId                                              │
│  - name: String (Indexed)                                     │
│  - description: String                                        │
│  - price: Number                                              │
│  - category: Enum ['BREAKFAST','MEALS','SNACKS',...]          │
│  - foodType: Enum ['VEG', 'NON_VEG']                          │
│  - image: String (e.g. "/images/veg_biriyani.jpg")            │
│  - available: Boolean (Default: true)                         │
│  - preparationTime: Number (in minutes)                       │
│  - featured: Boolean                                          │
│  - timestamps: { createdAt, updatedAt }                       │
└───────────────────────────────────────────────────────────────┘
```

### Rationale for Schema Decisions:
1. **Embedded Order Items**:
   - An order's items are queried alongside the order 100% of the time (in order receipts, kitchen ticket queues, and order trackers). Embedding them eliminates multi-table relational joins and ensures atomic transactions.
2. **Historical Price Snapshot**:
   - By embedding `price` and `name` inside the order item subdocument, changes to a dish's future price in the `MenuItem` collection will not corrupt historical order receipts and financial totals.
3. **Unique Token Indexing**:
   - `token` has a unique MongoDB sparse index to ensure `CB-XXXX` collisions are impossible at the database engine level.
