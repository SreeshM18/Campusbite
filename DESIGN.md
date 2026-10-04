# CampusBite — Design System & Visual Specification

## 1. Aesthetic Vision & Human-Crafted Brand Philosophy

CampusBite is engineered as a **culinary-first, campus-centric experience**. The interface evokes warmth, freshness, speed, and trust without leaning into sterile corporate or generic neon AI tropes.

### Core Visual Principles
- **Food Warmth**: Warm terracotta, saffron gold, and deep canvas tones establish an appetizing dining ambiance.
- **Scannability & Speed**: Clear typographic hierarchy allows hungry students on short class breaks to quickly identify dishes, dietary tags, prep times, and prices.
- **Operational Density for Staff**: While the customer interface is spacious and welcoming, the Kitchen Staff Queue is high-density and tactile, prioritizing token clarity and 1-click status transitions.

---

## 2. Design Tokens & Color Palette

```css
:root {
  /* Brand Accents */
  --brand-primary: #e65100;         /* Warm Terracotta / Burnt Orange */
  --brand-primary-hover: #c64200;
  --brand-primary-light: #fff3e0;   /* Delicate Warm Cream */
  --brand-secondary: #272d3b;       /* Deep Campus Charcoal */
  --accent: #f59e0b;                /* Golden Saffron */
  --accent-light: #fef3c7;

  /* Surfaces & Canvas */
  --canvas: #f8f6f2;                /* Warm Editorial Ivory */
  --surface: #ffffff;
  --surface-subtle: #f1ede6;
  --surface-dark: #1b1f2b;

  /* Typography */
  --text-primary: #191d24;
  --text-secondary: #5a6474;
  --text-muted: #8b95a5;

  /* Dietary Badges */
  --veg-color: #2e7d32;             /* Forest Herb Green */
  --veg-bg: #e8f5e9;
  --veg-border: #a5d6a7;
  --nonveg-color: #c62828;          /* Controlled Crimson */
  --nonveg-bg: #ffebee;
  --nonveg-border: #ef9a9a;

  /* Status Tokens */
  --status-pending: #f59e0b;        /* Amber */
  --status-preparing: #2563eb;      /* Royal Blue */
  --status-ready: #16a34a;          /* Emerald Green */
  --status-completed: #4b5563;      /* Neutral Slate */
}
```

---

## 3. Typography Hierarchy

| Level | Font Family | Weight | Typical Size | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | Outfit | 800 | 2.5rem – 3.4rem | Homepage Hero Headline |
| **Section H1** | Outfit | 800 | 2.0rem – 2.2rem | Menu Page & Dashboard Headers |
| **Card H3** | Outfit | 700 | 1.15rem – 1.25rem | Food dish titles, Modal headers |
| **Body Text** | Plus Jakarta Sans | 400 / 500 | 0.95rem | Descriptions, subtitles, notices |
| **Price Callout** | Outfit | 800 | 1.25rem – 1.75rem | Menu & checkout totals |
| **CB-Token Ticket** | Space Mono | 700 / 800 | 1.75rem – 2.75rem | Official Canteen Pickup Badges |

---

## 4. Key Component Anatomy

### A. Dietary Indicators
- **Pure Veg**: Solid green dot enclosed within a square green boundary border.
- **Non-Veg**: Solid red triangle within a square red boundary border.

### B. Perforated Token Ticket (`TokenBadge`)
- High-contrast dashed terracotta border with concave side cutouts simulating a traditional physical meal coupon, rendered with mono-spaced numerals (`CB-XXXX`) for instant readability from 6+ feet across a busy canteen counter.

### C. Kitchen Kanban Ticket
- Color-coded top accent border matching current status (`Amber` for Pending, `Blue` for Preparing, `Green` for Ready).
- Large token display with customer role tag (`STUDENT` / `FACULTY`).
- Quantity stepper controls and 1-click status progression buttons.
