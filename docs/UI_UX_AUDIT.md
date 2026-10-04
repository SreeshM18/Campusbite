# CampusBite — UI/UX Audit & Interaction Review

## 1. Visual & Interaction Audit Matrix

| Domain | Legacy State | Assessment | Action | Migration Plan |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Identity** | Warm orange culinary palette with food court imagery. | **Strong**: Good campus food recognition and appetite appeal. | **KEEP** | Retain the warm terracotta/amber identity (`#e65100`), CampusBite name, and food-centric branding. |
| **Food Photography** | 14 assets generated in `src/main/webapp/images/`. | **Excellent**: High visual clarity, consistent framing, mouth-watering presentation. | **KEEP** | Port all 14 images to `client/public/images/` and maintain 16:10 aspect ratio. |
| **Typography** | Default sans-serif with Tailwind classes. | **Fair**: Readable but generic; lacks distinct editorial hierarchy. | **IMPROVE** | Implement Google Fonts pairing: *Outfit* (Display & Headers) + *Plus Jakarta Sans* (Body) + *Space Mono* (CB-Token). |
| **Dietary Badges** | Green/Red text pills. | **Good**: Essential for Indian campus dining context (Pure Veg vs Non-Veg). | **IMPROVE** | Implement standardized Indian FSSAI-style dietary icons (Green square-circle & Red square-triangle). |
| **Cart Drawer** | Fixed-position modal window. | **Fair**: Functional but clunky animation; lacked persistent mobile bar. | **IMPROVE** | Modern slide-over drawer with itemized stepper controls, pickup scheduler, and sticky floating mobile tray bar. |
| **Pickup Scheduling** | Basic select dropdown. | **Good Concept / Weak UI**: Dropdown was easy to miss. | **IMPROVE** | Tactile button grid (`Immediate`, `15 Mins`, `30 Mins`, `45 Mins`, `1 Hour`) with auto-calculated estimated collection times. |
| **Token Presentation** | Plain modal text number. | **Critical Feature**: The token is the core pickup artifact. | **REPLACE** | High-contrast perforated **Digital Token Badge** (`CB-XXXX`) with dashed cutouts, readable across a busy counter. |
| **Order Tracking** | Timer-based simulated progression. | **Incomplete**: Only showed simulated progress; didn't reflect real staff actions. | **REPLACE** | Real-time 4-stage visual timeline connected live to MongoDB order status updates from the kitchen. |
| **Staff Dashboard** | Monolithic HTML page with Tailwind CDN. | **Good Utility / Disconnected**: High-density concept was sound, but lacked real multi-device sync. | **IMPROVE** | React Kitchen Kanban Queue with live KPI cards and 1-click status progression (`Start Cooking`, `Mark Ready`, `Handed Over`). |
| **Payment Modal** | Hardcoded ₹100 QR code. | **Broken**: Hardcoded amount confused users whose subtotal was different. | **REPLACE** | Dynamic sandbox payment module generating dynamic UPI URIs with the exact cart subtotal and clear demo mode labels. |

---

## 2. Accessibility & Responsive Viewport Review

1. **Responsive Viewport Breakdown**:
   - **Mobile (360px – 430px)**: The sticky bottom food tray bar is crucial for quick navigation between menu and checkout.
   - **Tablet / Counter Terminal (768px – 1024px)**: The Staff Kitchen Command Center requires dense 2-column or 3-column ticket grids for high-throughput service.
   - **Desktop (1280px+)**: Spacious 3-column to 4-column menu discovery grid with comfortable scanning margins.
2. **Accessibility Standards (WCAG 2.1 AA)**:
   - Contrast ratio $\ge 4.5:1$ on all interactive buttons and price displays.
   - Distinct dietary symbols (not relying on color alone for color-blind users).
   - Clear focus rings (`0 0 0 3px rgba(230, 81, 0, 0.12)`) on all inputs and interactive elements.
