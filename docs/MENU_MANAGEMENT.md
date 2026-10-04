# CampusBite Menu Management & Inventory Control Architecture

## 1. Overview & Core Authority
The CampusBite Menu Management module gives canteen staff complete control over the live catalog, pricing, preparation times, dietary attributes, and real-time inventory stock without requiring code changes or redeployments.

**MongoDB is the single source of truth.** When staff modifies an item's price, description, or availability status in `/staff/menu`, the change updates the database immediately. The student-facing catalog (`GET /api/menu`) retrieves live database documents on every query.

---

## 2. Data Model: `MenuItem` Schema

| Field | Type | Rules & Validation | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, trimmed, 2–120 chars | Name of the food item (e.g. `Veg Dum Biryani`) |
| `description` | String | Required, trimmed, 3–500 chars | Culinary description and key ingredients |
| `price` | Number | Required, numeric, min: ₹1 | Price in INR. Authoritative price used for order checkout |
| `category` | String (Enum) | `BREAKFAST`, `MEALS`, `FAST_FOOD`, `SNACKS`, `BEVERAGES`, `DESSERTS`, `HEALTHY` | Primary category used in filtering |
| `subcategory` | String | Trimmed, default: `General` | Secondary classification (e.g. `South Indian`, `Biryani`, `Chai`) |
| `foodType` | String (Enum) | `VEG`, `NON_VEG` | Dietary badge classification |
| `image` | String | Required URL or asset path | Path to photography asset (with fallback handling) |
| `availabilityStatus` | String (Enum) | `AVAILABLE`, `SOLD_OUT`, `UNAVAILABLE` | Operational stock state |
| `available` | Boolean | Default: `true` | Synced with `availabilityStatus === 'AVAILABLE'` for legacy query support |
| `isArchived` | Boolean | Default: `false` | Soft-deletion flag. Hides item without breaking historical orders |
| `preparationTime` | Number | Min: 1 minute, default: 10 | Estimated cooking/assembly duration in minutes |
| `featured` | Boolean | Default: `false` | Promoted as Chef's Special on customer home screen |
| `mealPeriod` | String (Enum) | `ALL_DAY`, `BREAKFAST`, `LUNCH`, `EVENING` | Target meal timing |

---

## 3. Availability Semantics

1. **`AVAILABLE` (In Stock)**:
   - Item is fully orderable.
   - Customer UI shows active `+ Add` button and stepper controls.
2. **`SOLD_OUT` (Temporary Stock Shortage)**:
   - Dish is out of ingredients or cooked batch is depleted for the day.
   - Customer UI keeps the dish visible for awareness, but disables the `Add` button with a high-contrast `Sold Out` badge.
   - Server-side checkout blocks any attempt to submit an order containing sold-out items with `400 Bad Request`.
3. **`UNAVAILABLE` (Disabled / Seasonally Off-Menu)**:
   - Dish is temporarily removed from the canteen's offerings.
   - Customer endpoint `GET /api/menu` completely excludes unavailable items.
4. **`isArchived: true` (Soft Deleted)**:
   - Dish is deactivated and archived from both customer views and the primary active staff inventory.
   - Can be filtered and restored under the *Archived Items* staff tab.
   - **Crucial:** Historical customer order receipts are never broken because orders store embedded snapshots (`nameAtOrder`, `priceAtOrder`, `quantity`).

---

## 4. Staff Workflows

### 4.1 Fast Inline Availability Toggles (<50ms)
- Staff can change an item's status directly from the table row dropdown between `✓ In Stock`, `⚠ Sold Out`, and `✕ Disabled`.
- Fires `PATCH /api/menu/:id/availability` with atomic Mongoose save and updates the table instantaneously.

### 4.2 Bulk Status Actions
- Staff can check multiple items across categories and click `Mark In Stock`, `Mark Sold Out`, or `Hide / Disable` to update high volumes of items during peak shifts.
- Powered by `PATCH /api/menu/bulk/availability` executing atomic MongoDB `updateMany`.

### 4.3 Add / Edit Food Modal
- Integrated validation catches invalid inputs before submission:
  - Dish name length $\ge 2$ characters.
  - Price $> 0$.
  - Image URL with instant live image preview box and broken image fallback.
  - Subcategory attribution for improved student searchability.

### 4.4 Duplicate Dish
- Pre-fills the creation modal with an existing item's specifications and appends `(Copy)` to speed up entry of dish variations (e.g. creating *Egg Fried Rice* from *Veg Fried Rice*).

---

## 5. Security & Validation Rules

- **Role Gate:** All mutating endpoints (`POST /api/menu`, `PATCH /api/menu/:id`, `PATCH /api/menu/:id/availability`, `PATCH /api/menu/:id/archive`, `DELETE /api/menu/:id`, `PATCH /api/menu/bulk/availability`) are strictly protected by `protect` + `requireStaff` middleware.
- **Whitelist Protection:** Prevents mass assignment vulnerabilities by explicitly whitelisting mutable fields before updating database documents.
- **Stale Cart Authority:** If a student added an item at ₹80 and staff revised the price to ₹100, the checkout controller re-fetches the authoritative price from MongoDB and charges ₹100.
