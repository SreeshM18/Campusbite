# CampusBite Design References & Pattern Library

This document synthesizes design principles and interaction patterns extracted across research references into CampusBite's unified design system.

---

## 1. Brand & Color References
- **Inspiration**: Warm culinary amber palettes paired with deep slate charcoal surfaces.
- **CampusBite Adaptation**:
  - Primary Brand: `#e65100` (Warm Amber Orange)
  - Secondary Slate: `#272d3b` (Deep Slate Charcoal)
  - Canvas: `#f8f6f2` (Warm Cream)
  - Surface: `#ffffff` (Pure White)
  - Dietary: Pure Veg (`#2e7d32` / `#e8f5e9`), Non-Veg (`#c62828` / `#ffebee`)

---

## 2. Header & Navigation Patterns
- **Inspiration**: Sticky navigation bar with restrained blur backdrop and live cart tray affordance.
- **CampusBite Adaptation**:
  - Sticky header with `72px` desktop height, `backdrop-filter: blur(12px)`.
  - Brand Logo + Title + Tagline ("Smart Canteen Pre-Order").
  - Desktop Navigation links (`Menu`, `My Orders`, `Kitchen Queue`, `Manage Menu`).
  - Tray button with high-contrast count badge and avatar initials circle for authenticated student.

---

## 3. Search & Category Filter Toolbar
- **Inspiration**: Top-tier segmented category tabs with full-width search input and clear button (`X`).
- **CampusBite Adaptation**:
  - Instant client-side search with debounce sync.
  - Authentic dietary segmented toggle (`All Diets`, `Pure Veg`, `Non-Veg`).
  - Horizontal scrolling category carousel with smooth touch scroll and visible active state.
  - Live result count (`Showing 18 dishes matching "Biryani"`).
  - 1-click `Reset All Filters` recovery action.

---

## 4. Food Card Patterns
- **Inspiration**: Food-first card hierarchy with 4:3 cover photo, clear price, and instant quantity stepper.
- **CampusBite Adaptation**:
  - 4:3 cover photo with smooth hover zoom and graceful SVG fallback.
  - Authentic FSSAI-style dietary badge (Green square/circle, Red square/triangle).
  - Prep time pill (`10-12 mins prep`).
  - Display price in tabular bold numerals (`₹120`).
  - `+ Add` button transitioning to `- [count] +` stepper on click.
  - "Sold Out Today" subtle watermark and disabled CTA for unavailable dishes.

---

## 5. Cart Drawer & Mobile Sticky Bar
- **Inspiration**: Off-canvas slide-in tray with item breakdown, trash removal, pickup scheduler, and checkout button.
- **CampusBite Adaptation**:
  - Slide-in drawer on desktop, floating sticky bottom tray on mobile.
  - Interactive pickup window scheduler (Immediate, 15m, 30m, 45m, 1h).
  - High hit area button with safe-area spacing (`env(safe-area-inset-bottom, 16px)`).

---

## 6. Orders & Kitchen Display System (KDS)
- **Inspiration**: High-visibility kitchen tickets with alphanumeric pickup tokens (`CB-XXXX`) and order age timers.
- **CampusBite Adaptation**:
  - Large monospace token display (`CB-1042`) in `Space Mono`.
  - Step progression timeline (`Placed` → `Preparing` → `Ready for Pickup` → `Completed`).
  - 1-click status advancement buttons for kitchen staff ("Start Cooking", "Mark Ready", "Complete Handover").
