# CampusBite — REST API Documentation

Base URL: `/api` (or `http://localhost:5000/api`)  
Authentication: HTTP-Only SameSite Cookie (`token`) or `Authorization: Bearer <token>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new student or faculty account. (Public role escalation to `CANTEEN_STAFF` is blocked).

**Request Body:**
```json
{
  "name": "Alex Rivera",
  "email": "alex.rivera@campusbite.edu",
  "password": "password123",
  "role": "STUDENT" // "STUDENT" | "FACULTY"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "660c1e8b2f1a8c001e3d4e51",
    "name": "Alex Rivera",
    "email": "alex.rivera@campusbite.edu",
    "role": "STUDENT",
    "createdAt": "2026-10-03T18:00:00.000Z"
  }
}
```

---

### `POST /api/auth/login`
Authenticates user with email and password and sets secure HTTP-Only cookie.

**Request Body:**
```json
{
  "email": "student@campusbite.edu",
  "password": "student123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "660c1e8b2f1a8c001e3d4e52",
    "name": "Alex Rivera (Student)",
    "email": "student@campusbite.edu",
    "role": "STUDENT"
  }
}
```

---

### `POST /api/auth/logout`
Clears the session cookie.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### `GET /api/auth/me`
Fetches authenticated user profile from token session.

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "660c1e8b2f1a8c001e3d4e52",
    "id": "660c1e8b2f1a8c001e3d4e52",
    "name": "Alex Rivera",
    "email": "student@campusbite.edu",
    "role": "STUDENT",
    "createdAt": "2026-10-03T18:00:00.000Z"
  }
}
```

---

### `PATCH /api/auth/profile` *(Protected)*
Updates user profile information (Name only). Role and Email are protected from mass assignment.

**Request Body:**
```json
{
  "name": "Alex Rivera Senior"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "660c1e8b2f1a8c001e3d4e52",
    "name": "Alex Rivera Senior",
    "email": "student@campusbite.edu",
    "role": "STUDENT"
  }
}
```

---

### `PATCH /api/auth/password` *(Protected)*
Updates account password after verifying the current password against bcrypt hash.

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePassword2026"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully! You may continue your session."
}
```

---

## 2. Menu Endpoints (`/api/menu`)

### `GET /api/menu` *(Public)*
Fetches active, non-archived canteen dishes with optional query filters.

**Query Parameters:**
- `category`: `ALL` | `BREAKFAST` | `MEALS` | `FAST_FOOD` | `SNACKS` | `BEVERAGES` | `DESSERTS` | `HEALTHY`
- `foodType`: `ALL` | `VEG` | `NON_VEG`
- `search`: text query matching name, subcategory, or description
- `featured`: `true` | `false`
- `available`: `true` | `false`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "660c1e8b2f1a8c001e3d4e60",
      "name": "Veg Dum Biryani",
      "description": "Fragrant basmati rice slow-cooked with fresh vegetables...",
      "price": 140,
      "category": "MEALS",
      "subcategory": "Rice & Biryani",
      "foodType": "VEG",
      "image": "/images/veg_biriyani.jpg",
      "availabilityStatus": "AVAILABLE",
      "available": true,
      "preparationTime": 20,
      "featured": true
    }
  ]
}
```

---

### `GET /api/menu/staff` *(Staff Only)*
Fetches all menu items (including sold out, disabled, and archived) along with live inventory counters (`totalItems`, `availableCount`, `soldOutCount`, `unavailableCount`, `featuredCount`, `archivedCount`).

---

### `POST /api/menu` *(Staff Only)*
Creates a new menu item with strict server-side validation.

**Request Body:**
```json
{
  "name": "Paneer Butter Masala Combo",
  "description": "Rich creamy cottage cheese gravy served with 2 hot butter naans.",
  "price": 160,
  "category": "MEALS",
  "subcategory": "North Indian",
  "foodType": "VEG",
  "image": "/images/veg_biriyani.jpg",
  "preparationTime": 15,
  "availabilityStatus": "AVAILABLE",
  "featured": true
}
```

---

### `PATCH /api/menu/:id` *(Staff Only)*
Updates menu item attributes with mass assignment protection.

---

### `PATCH /api/menu/:id/availability` *(Staff Only)*
Fast inline status update (`availabilityStatus: 'AVAILABLE' | 'SOLD_OUT' | 'UNAVAILABLE'`).

---

### `PATCH /api/menu/:id/archive` *(Staff Only)*
Non-destructively archives or restores an item (`isArchived: true / false`).

---

### `PATCH /api/menu/bulk/availability` *(Staff Only)*
Batch updates availability for an array of selected item IDs.

---

### `DELETE /api/menu/:id` *(Staff Only)*
Permanently deletes menu item from database.

---

## 3. Order Endpoints (`/api/orders`)

### `POST /api/orders` *(Authenticated)*
Places a new food pre-order with authoritative server-side price recalculation.

**Request Body:**
```json
{
  "items": [
    { "menuItemId": "660c1e8b2f1a8c001e3d4e60", "quantity": 1 },
    { "menuItemId": "660c1e8b2f1a8c001e3d4e69", "quantity": 2 }
  ],
  "pickupType": "15mins",
  "pickupTime": "In 15 Minutes (Ready around 01:15 PM)",
  "paymentMethod": "UPI",
  "specialInstructions": "Extra chilled coffee"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully! Token generated.",
  "data": {
    "_id": "660c1e8b2f1a8c001e3d4e75",
    "user": "660c1e8b2f1a8c001e3d4e52",
    "token": "CB-1042",
    "items": [
      { "menuItem": "660c1e8b2f1a8c001e3d4e60", "name": "Veg Dum Biryani", "price": 140, "quantity": 1 },
      { "menuItem": "660c1e8b2f1a8c001e3d4e69", "name": "Frothy Classic Cold Coffee", "price": 60, "quantity": 2 }
    ],
    "subtotal": 260,
    "status": "PENDING",
    "pickupType": "15mins",
    "pickupTime": "In 15 Minutes (Ready around 01:15 PM)",
    "paymentStatus": "PAID",
    "paymentMethod": "UPI",
    "createdAt": "2026-10-03T18:05:00.000Z"
  }
}
```

---

### `GET /api/orders/my` *(Authenticated)*
Returns the logged-in user's order history.

### `GET /api/orders/:id` *(Owner or Staff)*
Returns single order details and real-time status.

### `GET /api/orders/staff/all` *(Staff Only)*
Returns all active kitchen orders with optional `?status=PENDING` filter.

### `GET /api/orders/staff/stats` *(Staff Only)*
Returns canteen kitchen KPI statistics (total, pending, preparing, ready, completed, revenue).

### `PATCH /api/orders/:id/status` *(Staff Only)*
Updates order state along strict transitions (`PENDING` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`).
