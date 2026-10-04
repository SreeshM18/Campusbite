# CampusBite REST API Specification

The CampusBite MERN platform exposes a secure REST API with JWT bearer authentication, role-based access control, server-authoritative pricing calculations, structured audit timestamps, and pagination.

All endpoints exchange data using standard `application/json` format.

---

## Base Path
- Local Dev Server: `http://localhost:5000/api`
- Production Gateway: `/api`

---

## 1. Authentication Endpoints

### Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Alex Rivera",
    "email": "student@campusbite.edu",
    "password": "Password123!",
    "role": "STUDENT"
  }
  ```
- **Responses**: `201 Created` or `400 Bad Request`

### Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "student@campusbite.edu",
    "password": "Password123!"
  }
  ```
- **Responses**: `200 OK` (sets HTTP-only cookie and returns JWT + user profile) or `401 Unauthorized`

---

## 2. Menu Endpoints

### Get Menu Items (Public / Student)
- **Method**: `GET`
- **Path**: `/api/menu`
- **Query Params**:
  - `category`: Filter category (e.g. `Breakfast`, `Hot Meals`, `Beverages`)
  - `foodType`: `VEG` or `NON_VEG`
  - `search`: Keyword substring match
- **Response `200 OK`**: List of menu items with current pricing and availability.

---

## 3. Order Endpoints

### Place Canteen Pre-Order
- **Method**: `POST`
- **Path**: `/api/orders`
- **Auth Required**: Yes (`STUDENT` or `FACULTY`)
- **Request Body**:
  ```json
  {
    "items": [
      { "menuItemId": "60d0fe4f5311236168a109cb", "quantity": 2 }
    ],
    "pickupType": "30mins",
    "pickupTime": "In 30 Minutes (Ready around 01:21 AM)",
    "paymentMethod": "UPI",
    "specialInstructions": "Extra crispy dosa please"
  }
  ```
- **Responses**: `201 Created` with generated token `CB-XXXX` and server-calculated subtotal.

### Get My Orders (with Filters & Pagination)
- **Method**: `GET`
- **Path**: `/api/orders/my`
- **Auth Required**: Yes (`STUDENT` or `FACULTY`)
- **Query Parameters**:
  - `status`: Filter by `ALL`, `ACTIVE` (`PENDING`, `PREPARING`, `READY`), `COMPLETED`, `CANCELLED`
  - `search`: Substring search matching token (`CB-XXXX`) or dish names
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 2,
    "total": 2,
    "page": 1,
    "totalPages": 1,
    "activeCount": 1,
    "pastCount": 1,
    "data": [
      {
        "_id": "6ac1593e627cb9736de5cccc",
        "token": "CB-2751",
        "status": "READY",
        "subtotal": 85,
        "pickupTime": "In 30 Minutes (Ready around 01:36 AM)",
        "createdAt": "2026-10-03T19:36:30.823Z",
        "preparingAt": "2026-10-03T19:38:04.999Z",
        "readyAt": "2026-10-03T19:38:05.025Z",
        "items": [...]
      }
    ]
  }
  ```

### Get Order by ID
- **Method**: `GET`
- **Path**: `/api/orders/:id`
- **Auth Required**: Yes (Owner or Canteen Staff)
- **Response `200 OK`**: Single order document with item snapshots, live status, and timestamps.
- **Response `403 Forbidden`**: Returned if user is not the order owner.

### Cancel Pre-Order (Student Action)
- **Method**: `PATCH`
- **Path**: `/api/orders/:id/cancel`
- **Auth Required**: Yes (Order Owner only)
- **Validation Rule**: Only orders in `PENDING` status can be cancelled. Once cooking begins (`PREPARING`), returns `400 Bad Request`.
- **Request Body**:
  ```json
  {
    "reason": "Break timing changed by faculty"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Order successfully cancelled.",
    "data": {
      "_id": "6ac1593e627cb9736de5cccc",
      "status": "CANCELLED",
      "cancelledAt": "2026-10-03T19:38:15.000Z",
      "cancelReason": "Break timing changed by faculty"
    }
  }
  ```

### Update Order Status (Canteen Staff Action)
- **Method**: `PATCH`
- **Path**: `/api/orders/:id/status`
- **Auth Required**: Yes (`CANTEEN_STAFF` or `ADMIN`)
- **Allowed Transitions**:
  - `PENDING` → `PREPARING` (records `preparingAt`)
  - `PREPARING` → `READY` (records `readyAt`)
  - `READY` → `COMPLETED` (records `completedAt`)
  - Any Active → `CANCELLED` (records `cancelledAt`)
- **Response `200 OK`**: Updated order object.
