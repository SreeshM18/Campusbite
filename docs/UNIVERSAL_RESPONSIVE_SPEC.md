# CAMPUSBITE — UNIVERSAL RESPONSIVE & ADAPTIVE STANDARD SPECIFICATION

## 1. Executive Summary & Design System Philosophy

CampusBite is engineered as a **genuinely adaptive responsive web application** rather than a fixed-width mobile frame or a stretched desktop interface. The UI adapts dynamically according to **available viewport real-estate** and **input method (touch vs. pointer/keyboard)** across:

* **Small Mobile Phones (320px – 359px):** Ultra-compact stress-tested single-column flow with zero horizontal overflow, 12–16px gutters, and preserved touch ergonomics.
* **Standard Mobile Phones (360px – 430px):** High-velocity food discovery, full-width search, horizontal category pill scrollers, touchable quantity steppers, and safe-area floating cart triggers.
* **Tablets & Foldables (600px – 1024px Portrait & Landscape):** Purpose-built multi-column catalog and an operational 2-to-3 column kitchen dashboard with large touch controls (≥48px) for kitchen staff.
* **Laptops (1024px – 1366px, 1366×768):** Full desktop navigation, 3-column menu grid, structured right-drawer tray, and 2-column checkout.
* **Desktop & Ultrawide Displays (1440px – 1920px+):** Centered max-width bounded container (`--container-standard: 1240px`, `--container-wide: 1400px`), balanced whitespace, and 4-column food discovery.

---

## 2. Universal Fluid Architecture & Viewport Standards

### 2.1 Fluid Viewport & Sizing Standards
```css
/* Container Primitive */
.container {
  width: 100%;
  max-width: var(--container-standard); /* 1240px */
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--gutter-desktop);  /* 32px */
  padding-right: var(--gutter-desktop);
}

@media (min-width: 1440px) {
  .container {
    padding-left: var(--gutter-wide);    /* 40px */
    padding-right: var(--gutter-wide);
  }
}

@media (max-width: 1024px) {
  .container {
    padding-left: var(--gutter-tablet);  /* 24px */
    padding-right: var(--gutter-tablet);
  }
}

@media (max-width: 640px) {
  .container {
    padding-left: var(--gutter-mobile);  /* 16px */
    padding-right: var(--gutter-mobile);
  }
}

@media (max-width: 359px) {
  .container {
    padding-left: var(--gutter-mobile-sm); /* 12px */
    padding-right: var(--gutter-mobile-sm);
  }
}
```

### 2.2 Modern Viewport Units & Safe Area Insets
* **Dynamic Viewport Height (`100dvh` / `100svh`):** Applied on `body`, `#root`, and modal overlays (`max-height: 90dvh`) to prevent layout shifts during virtual keyboard appearance or mobile browser address bar collapse.
* **iOS Safe Areas:**
  ```css
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
  padding-left: env(safe-area-inset-left, 0);
  padding-right: env(safe-area-inset-right, 0);
  ```
* **Sticky Mobile Cart Bar:**
  ```css
  .sticky-mobile-cart-bar {
    position: fixed;
    bottom: calc(0.85rem + env(safe-area-inset-bottom, 0px));
    left: 0;
    right: 0;
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    z-index: 40;
  }
  ```

---

## 3. Touch Ergonomics & Input Method Adaptation

### 3.1 Minimum Touch Targets (WCAG 2.1 AA / AAA)
* Standard interactive controls (buttons, navigation items, checkboxes, selects) adhere to `--touch-target-min: 44px`.
* High-velocity staff kitchen status actions adhere to `--touch-target-lg: 48px`.
* `touch-action: manipulation;` and `-webkit-tap-highlight-color: transparent;` applied across all clickable elements to eliminate mobile tap latency.

### 3.2 Pointer & Hover Separation
* Hover micro-animations, image zoom transforms, and button shadow lifts are scoped within `@media (hover: hover) and (pointer: fine)` so touch-based interactions never produce sticky hover states.

---

## 4. Breakpoint Transformation Matrix

| Viewport Range | Screen Category | Menu Composition | Staff Dashboard | Checkout Layout | Cart Affordance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **320px – 359px** | Small Mobile Stress-Test | Single-column compact cards | Tabbed single-ticket stream | Sequential 1-col stack | Floating bottom tray pill |
| **360px – 430px** | Standard Phone (iOS / Android) | 1-col high-density cards | Tabbed single-ticket stream | Sequential 1-col stack | Floating bottom tray pill |
| **600px – 767px** | Large Phone / Small Tablet | 2-column food grid | Dual-column ticket stream | Sequential 1-col stack | Drawer / Sticky bar |
| **768px – 1024px** | Tablet (iPad portrait / landscape) | 2 to 3-column food grid | 2-to-3 column operational queue | 2-column adaptive flow | Slide-in drawer |
| **1025px – 1366px**| Laptop & Standard Displays | 3-column food grid | 3-column full Kanban queue | 2-column with sticky total | Slide-in drawer |
| **1440px – 1920px+**| Desktop & Ultrawide Monitors | 4-column capped grid | 3-column full Kanban queue | 2-column with sticky total | Slide-in drawer |

---

## 5. Viewport QA & Verification Matrix

The responsive layout has been inspected and verified across all target viewports:
* `320 × 568` (iPhone SE 1st gen / Small Android) — Zero overflow, intact token badges
* `360 × 640` (Standard Android Small) — Clean 1-col layout with horizontal pill scroller
* `375 × 667` (iPhone 8 / SE 2nd gen) — Smooth touch steppers and safe gutters
* `390 × 844` (iPhone 12/13/14) — Dynamic Island & safe-area compliant
* `393 × 852` (iPhone 15/16) — Dynamic Island & safe-area compliant
* `412 × 915` (Samsung Galaxy S22/S24 / Pixel 7) — Android navigation bar safe
* `430 × 932` (iPhone 14/15/16 Pro Max) — Rich vertical flow
* `600 × 960` (Android 7-inch Tablets) — 2-column food grid
* `768 × 1024` (iPad Mini / Portrait Tablet) — 2-column menu & touch kitchen queue
* `820 × 1180` (iPad Air 10.9-inch) — 2-to-3 column menu & high-density kitchen queue
* `1024 × 768` (Landscape Tablet) — 3-column menu & full 3-column kitchen Kanban
* `1024 × 1366` (iPad Pro 12.9-inch Portrait) — Generous spacing with 3-column menu
* `1280 × 720` (Compact HD Laptop) — Intact header & above-the-fold food visibility
* `1366 × 768` (Mainstream College Laptop) — Balanced header height & 3-column grid
* `1440 × 900` (MacBook Air / Pro) — 4-column menu with clean side gutters
* `1536 × 864` (Standard Windows Laptop) — 4-column menu with bounded container
* `1920 × 1080` (Full HD Desktop / Monitor) — Centered 1240px container with balanced margins
