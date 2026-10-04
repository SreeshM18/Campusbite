# CampusBite Figma & Modern Web Design Pattern Research

## 1. Research Overview & Scope
To inform CampusBite's large-catalog scalability and human-crafted UX, we researched leading Figma Community design systems, modern restaurant web applications, quick-service cafe platforms, tablet POS kitchen systems, and self-ordering kiosk patterns.

---

## 2. Archetype Pattern Analysis

### 2.1 Figma Community: Food Ordering UI Kits (Mobile-First Apps)
- **Patterns Analyzed**: Bottom navigation bars, horizontal category carousels, floating cart badges, item steppers (`- 1 +`), dietary pills.
- **What Was Useful**:
  - Immediate inline transition from `+ Add` to interactive quantity stepper (`Minus | Quantity | Plus`) without opening modals.
  - Sticky bottom mobile cart bar displaying item count, subtotal, and checkout arrow action.
- **What Was Rejected for CampusBite**:
  - Floating 3D illustrations of delivery scooters and GPS tracking maps.
  - 28px+ giant pill radiuses on non-pill content.
  - Opaque glassmorphism blur layers that obscure card photography.

### 2.2 Modern Quick-Service Cafe Web Applications (Desktop & Responsive)
- **Patterns Analyzed**: Sweetgreen, Blue Bottle Coffee, Toast POS web ordering, Shake Shack digital web menu.
- **What Was Useful**:
  - 4:3 aspect ratio food photography allowing clear visual inspection of dishes while preserving high vertical scan density.
  - Two-tier category structure: Primary broad groupings (`Meals`, `Drinks`, `Snacks`) + immediate subcategory pills.
  - Tabular numeric price formatting preventing card jitter on quantity changes.
- **What Was Rejected for CampusBite**:
  - Hidden slide-out hamburger navigation on 1440px desktop displays.
  - Overly sparse white-space requiring 15 viewport scrolls to view 20 items.

### 2.3 Tablet Kitchen Display Systems (KDS) & POS Interfaces
- **Patterns Analyzed**: Square for Restaurants, Toast KDS, Lightspeed POS, Grubhub for Kitchens.
- **What Was Useful**:
  - High-contrast, color-coded status badges (`Pending` in Amber, `Preparing` in Cobalt Blue, `Ready` in Forest Green).
  - Prominent alphanumeric pickup tokens (`CB-XXXX`) rendered in monospace with high letter-spacing for distance legibility across kitchen counters.
  - Ticket aging indicators (`5 mins ago`, `12 mins ago`) to manage queue priorities.
- **What Was Rejected for CampusBite**:
  - Cluttered multi-window desktop modals.

---

## 3. Core Synthesis: The CampusBite Web Ordering Paradigm

| Pattern Dimension | Generic Food Delivery Pattern | CampusBite Canteen Solution |
| :--- | :--- | :--- |
| **Fulfillment Mode** | Address input → GPS Driver tracking | Fixed counter pickup with digital token (`CB-XXXX`) |
| **Catalog Hierarchy** | Infinite nested restaurant store pages | Single curated campus catalog with 0ms client-side filter engine |
| **Search Experience** | Multi-vendor global search with ads | Direct culinary keyword search with instant empty recovery |
| **Card Geometry** | Vertical card with giant image (280px tall) | Balanced 4:3 image with 2-line clamped title and bottom action bar |
| **Cart Accessibility** | Hidden in header or buried in checkout flow | Sticky mobile floating tray + instant desktop drawer |
| **Order Status UX** | Driver on motorbike animation | Kitchen progress timeline (`Placed` → `Cooking` → `Ready at Counter #3`) |

---

## 4. Responsive Layout Strategy Derived from Research
- **Mobile (360px – 430px)**: 1-column high-density card grid with horizontal-scrolling category carousel and sticky bottom cart bar.
- **Tablet (768px – 1024px)**: 2-column card grid with dual-tier category controls and tablet-optimized touch targets (≥44px).
- **Desktop (1280px – 1920px)**: Centered `1240px` / `1400px` container with 4-column balanced grid, sticky header tray count, and sidebar/tab access.

---

## 5. Phase 07 Research: Cart, Express Checkout & Ticket Tokens

### 5.1 Food Tray & Cart Patterns
- **Quick-Access Tray Drawer**: Sliding canvas tray allows students to review orders without navigating away from the menu.
- **Dedicated `/cart` Route**: Full two-column desktop / single-column mobile view for comprehensive order customization and scheduled pickup selection.
- **Micro-interactions**: Instant feedback on quantity increment (`+`) / decrement (`-`) and item removal without full-page reloads.

### 5.2 Express Canteen Checkout (No Ecommerce Friction)
- **Elimination of Delivery Clutter**: No shipping addresses, postal codes, courier tips, or complex delivery forms.
- **Dynamic Clock Computation**: Translates abstract minutes into real actionable clock times (e.g., `In 30 Minutes (Ready around 01:21 AM)`).
- **Sandbox Payment Transparency**: Clear, honest disclaimers identifying academic simulation with dynamic server-verified bill calculation.

### 5.3 Perforated Ticket Token Architecture
- **Inspiration**: Traditional cinema/canteen physical paper stub tickets with half-circle edge cutouts and dashed borders.
- **Legibility**: Monospace typography with `clamp(1.75rem, 6vw, 2.75rem)` and high-contrast styling ensures token `CB-XXXX` is easily read from 2 meters away at Counter #3.

### 5.4 4-Stage Kitchen Tracking Stepper
- **Linear Progress Stepper**: `Order Received (PENDING)` → `Cooking & Packing (PREPARING)` → `Ready for Pickup (READY)` → `Completed (COMPLETED)`.
- **Active State Highlighting**: Distinctive visual elevation, ambient glow, and pulsing indicator on the active kitchen stage.

---

## 6. Phase 08 Research: Post-Order & Fast Campus Reordering

### 6.1 Active Order Priority Architecture
- **Cognitive Load Reduction**: Active orders requiring immediate student attention (`PENDING`, `PREPARING`, `READY`) sit at the very top of the interface in dedicated high-contrast cards, while past orders are grouped below in compact rows.
- **Ready State Elevation**: When an order transitions to `READY`, the UI elevates with an emerald border and clear counter directions (*"Counter #3 Express Desk"*), making status identifiable in <1 second.

### 6.2 Intelligent Reorder UX Patterns
- **Price & Availability Revalidation**: Rather than blindly cloning historical cart objects, clicking "Order Again" fetches live catalog data, matches item IDs, applies current prices, and notifies students transparently if specific dishes are sold out.
- **Cart Merge Logic**: Reordered items merge cleanly into the food tray respecting single-item limits (max 20 per item) and redirect the student to `/cart` for final verification.

---

## 7. Phase 09 Research: Kitchen Display System (KDS) & Operational Staff Ergonomics

### 7.1 Ergonomic Kitchen Display Systems (KDS)
- **High-Density Operational Shell**: Designed for high-glare, fast-paced kitchen environments. Contrasting dark command headers with neutral slate work areas reduce eye fatigue and maximize information hierarchy.
- **Token Hierarchy & Distance Legibility**: The order token (`CB-XXXX`) is displayed in large monospace font (`1.65rem+`) with high contrast so staff can call out orders without leaning into the screen.
- **Quantity-First Item Layout**: Displays `2× Masala Dosa` rather than `Masala Dosa x 2` or paragraph text, allowing line cooks to scan quantities instantaneously during peak lunch rushes.

### 7.2 Single-Tap Clear Status Transitions
- **One Primary Action**: Every ticket exposes exactly one unambiguous primary button (`Start Preparing` → `Mark Ready at Counter #3` → `Complete Handover`), preventing accidental skips.
- **Touch-First Target Standards**: All action buttons, filter tabs, and drawer buttons maintain a minimum 44px vertical touch target for greasy or gloved tablet use.
- **Visual Urgency without Alarm Fatigue**: Orders exceeding 15 minutes in pending or cooking status display a subtle amber aging alert (`Priority: Placed 15 mins ago`) without intrusive alarm sounds or jarring flashes.



