# CampusBite MERN REST API Specification & Blueprint

## 1. Architectural Principles & Standards
- **Protocol**: HTTP/1.1 over TLS with JSON request/response payloads (`Content-Type: application/json`).
- **Authentication**: Stateless JSON Web Tokens (JWT) stored in HTTP-Only, Secure, `SameSite=Strict` cookies with Bearer header fallback.
- **Authorization**: Role-Based Access Control (RBAC) supporting `STUDENT`, `FACULTY`, and `CANTEEN_STAFF`.
- **Validation**: Schema-level input sanitization and validation on all request bodies and query parameters.
- **Status Codes**: RFC 9110 compliant status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).
- **Error Response Standard**:
  ```json
  {
    "success": false,
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "The requested menu item does not exist.",
      "details": []
    }
  }
  ```

---

## 2. Authentication & Identity Domain (`/api/auth`)

### 2.1 Register User
- **Method & Route**: `POST /api/auth/register`
- **Access Level**: Public
- **Description**: Registers a new customer (`STUDENT` or `FACULTY`). Note: `CANTEEN_STAFF` cannot be self-assigned in public registration.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@campus.edu",
    "password": "Password123!",
    "role": "STUDENT" // Optional, default STUDENT. Rejects CANTEEN_STAFF
  }
  ```
- **Validation Rules**:
  - `name`: Non-empty string, min 2 chars, max 60 chars.
  - `email`: Valid institutional or standard email format, converted to lowercase.
  - `password`: Min 8 characters with at least 1 number and 1 letter.
  - `role`: Must be either `STUDENT` or `FACULTY`.
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "660c2b5e4f1a2c3d4e5f6a7b",
      "name": "Jane Doe",
      "email": "jane@campus.edu",
      "role": "STUDENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure or Email already registered.

### 2.2 User Login
- **Method & Route**: `POST /api/auth/login`
- **Access Level**: Public
- **Description**: Authenticates user credentials via bcrypt verification and establishes session cookie/JWT.
- **Request Body**:
  ```json
  {
    "email": "jane@campus.edu",
    "password": "Password123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "660c2b5e4f1a2c3d4e5f6a7b",
      "name": "Jane Doe",
      "email": "jane@campus.edu",
      "role": "STUDENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password.

### 2.3 User Logout
- **Method & Route**: `POST /api/auth/logout`
- **Access Level**: Authenticated
- **Description**: Clears authentication cookies on the client browser.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### 2.4 Current User Session
- **Method & Route**: `GET /api/auth/me`
- **Access Level**: Authenticated (`STUDENT`, `FACULTY`, `CANTEEN_STAFF`)
- **Description**: Returns profile details for the authenticated user session.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "660c2b5e4f1a2c3d4e5f6a7b",
      "name": "Jane Doe",
      "email": "jane@campus.edu",
      "role": "STUDENT"
    }
  }
  ```

---

## 3. Menu & Catalog Domain (`/api/menu`)

### 3.1 Get All Active Menu Items
- **Method & Route**: `GET /api/menu`
- **Access Level**: Public
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g. `Snacks`, `Main Course`, `Beverages`).
  - `diet` (optional): Filter by dietary flag (`VEG`, `NON_VEG`).
  - `search` (optional): Case-insensitive text query on name or description.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 9,
    "data": [
      {
        "_id": "660c2b5e4f1a2c3d4e5f6a81",
        "name": "Royal Veg Biryani",
        "category": "Main Course",
        "price": 120.00,
        "isVeg": true,
        "isAvailable": true,
        "description": "Fragrant basmati rice layered with garden vegetables and aromatic spices.",
        "imageUrl": "/images/menu/royal_veg_biryani.jpg"
      }
    ]
  }
  ```

### 3.2 Get Menu Item by ID
- **Method & Route**: `GET /api/menu/:id`
- **Access Level**: Public
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "660c2b5e4f1a2c3d4e5f6a81",
      "name": "Royal Veg Biryani",
      "category": "Main Course",
      "price": 120.00,
      "isVeg": true,
      "isAvailable": true,
      "description": "Fragrant basmati rice...",
      "imageUrl": "/images/menu/royal_veg_biryani.jpg"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Item does not exist.

### 3.3 Create Menu Item
- **Method & Route**: `POST /api/menu`
- **Access Level**: Staff Only (`role: CANTEEN_STAFF`)
- **Request Body**:
  ```json
  {
    "name": "Paneer Butter Masala",
    "category": "Main Course",
    "price": 140.00,
    "isVeg": true,
    "isAvailable": true,
    "description": "Rich cottage cheese cooked in creamy tomato butter gravy.",
    "imageUrl": "/images/menu/paneer_butter_masala.jpg"
  }
  ```
- **Success Response (`201 Created`)**: Returns created item object.
- **Error Responses**:
  - `403 Forbidden`: User is not canteen staff.

### 3.4 Update Menu Item Details
- **Method & Route**: `PATCH /api/menu/:id`
- **Access Level**: Staff Only (`role: CANTEEN_STAFF`)
- **Request Body**: Partial update object (`name`, `price`, `category`, `description`, `imageUrl`).
- **Success Response (`200 OK`)**: Returns updated item object.

### 3.5 Toggle Item Availability
- **Method & Route**: `PATCH /api/menu/:id/availability`
- **Access Level**: Staff Only (`role: CANTEEN_STAFF`)
- **Request Body**:
  ```json
  {
    "isAvailable": false
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "660c2b5e4f1a2c3d4e5f6a81",
      "isAvailable": false
    }
  }
  ```

### 3.6 Delete Menu Item
- **Method & Route**: `DELETE /api/menu/:id`
- **Access Level**: Staff Only (`role: CANTEEN_STAFF`)
- **Success Response (`200 OK`)**: `{"success": true, "message": "Menu item deleted"}`

---

## 4. Orders & Fulfillment Domain (`/api/orders`)

### 4.1 Place Order
- **Method & Route**: `POST /api/orders`
- **Access Level**: Authenticated (`STUDENT`, `FACULTY`, `CANTEEN_STAFF`)
- **Security Rule**: The server fetches actual item prices from MongoDB, verifies availability, and computes the authoritative `totalAmount`. Client-provided prices are ignored.
- **Request Body**:
  ```json
  {
    "items": [
      { "menuItemId": "660c2b5e4f1a2c3d4e5f6a81", "quantity": 2 },
      { "menuItemId": "660c2b5e4f1a2c3d4e5f6a84", "quantity": 1 }
    ],
    "pickupType": "PICKUP_NOW", // or "SCHEDULED"
    "scheduledTime": "13:30", // Required if SCHEDULED
    "paymentMethod": "UPI_QR"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "order": {
      "_id": "660c2b5e4f1a2c3d4e5f6a99",
      "orderToken": "TK-20261003-8472",
      "user": {
        "id": "660c2b5e4f1a2c3d4e5f6a7b",
        "name": "Jane Doe"
      },
      "items": [
        {
          "menuItemId": "660c2b5e4f1a2c3d4e5f6a81",
          "name": "Royal Veg Biryani",
          "price": 120.00,
          "quantity": 2,
          "subtotal": 240.00
        }
      ],
      "totalAmount": 285.00,
      "status": "PLACED",
      "pickupType": "PICKUP_NOW",
      "scheduledTime": null,
      "paymentStatus": "PAID",
      "createdAt": "2026-10-03T18:25:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Empty items list, item not available, or invalid scheduled time.

### 4.2 Get Current User Order History
- **Method & Route**: `GET /api/orders/my`
- **Access Level**: Authenticated
- **Security Rule**: Only returns orders matching `order.user == req.user.id`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 3,
    "orders": [ /* Array of user's orders sorted by createdAt DESC */ ]
  }
  ```

### 4.3 Get Specific Order Details
- **Method & Route**: `GET /api/orders/:id`
- **Access Level**: Authenticated
- **Authorization Rule**: User must own the order OR be `CANTEEN_STAFF`.
- **Success Response (`200 OK`)**: Order object with populated item snapshots.
- **Error Responses**:
  - `403 Forbidden`: Order belongs to another user.
  - `404 Not Found`: Order does not exist.

### 4.4 Get Staff Kitchen Orders
- **Method & Route**: `GET /api/orders/staff`
- **Access Level**: Staff Only (`role: CANTEEN_STAFF`)
- **Query Parameters**:
  - `status` (optional): Filter by status (`PLACED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`).
  - `limit` (optional): Max orders returned (default 50).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 12,
    "orders": [ /* Active orders array across all customers */ ]
  }
  ```

### 4.5 Update Order Status
- **Method & Route**: `PATCH /api/orders/:id/status`
- **Access Level**: Staff Only (`role: CANTEEN_STAFF`)
- **State Machine Transitions**:
  `PLACED` → `PREPARING` → `READY` → `COMPLETED` (or `CANCELLED`).
- **Request Body**:
  ```json
  {
    "status": "PREPARING"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "order": {
      "_id": "660c2b5e4f1a2c3d4e5f6a99",
      "status": "PREPARING",
      "updatedAt": "2026-10-03T18:30:15.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid status transition.
  - `403 Forbidden`: Non-staff user attempt.
