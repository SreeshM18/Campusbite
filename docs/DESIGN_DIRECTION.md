# CampusBite — Editorial Design Direction & Visual System

## 1. Brand Identity & Creative Personality

CampusBite is designed to feel like a modern, warm, and authentic **campus culinary hub**. It is:
- **Food-Led & Appetizing**: Warm saffron golds, deep terracotta, and warm ivory canvas.
- **Fast & Intuitive**: Minimal taps from menu browsing to token generation.
- **Trustworthy & Transparent**: Real kitchen statuses, honest preparation times, and clear pickup instructions.

---

## 2. Semantic Color System

```css
:root {
  /* Brand Accents */
  --brand-primary: #e65100;         /* Warm Terracotta / Burnt Orange */
  --brand-primary-hover: #c64200;
  --brand-primary-light: #fff3e0;   /* Cream Accent */
  --brand-secondary: #272d3b;       /* Deep Slate Charcoal */
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
  --veg-color: #2e7d32;             /* Pure Herb Green */
  --veg-bg: #e8f5e9;
  --veg-border: #a5d6a7;
  --nonveg-color: #c62828;          /* Controlled Crimson */
  --nonveg-bg: #ffebee;
  --nonveg-border: #ef9a9a;

  /* Status Colors */
  --status-pending: #f59e0b;
  --status-pending-bg: #fef3c7;
  --status-preparing: #2563eb;
  --status-preparing-bg: #dbeafe;
  --status-ready: #16a34a;
  --status-ready-bg: #dcfce7;
  --status-completed: #4b5563;
  --status-completed-bg: #f3f4f6;
}
```

---

## 3. Typography Pairings

- **Display & Headings**: `Outfit` (Weights: `700`, `800`) — Bold, energetic, geometric, and modern.
- **Body & Controls**: `Plus Jakarta Sans` (Weights: `400`, `500`, `600`, `700`) — Exceptional readability for food menus, prices, and instructions.
- **Digital Tokens & Timestamps**: `Space Mono` (Weights: `700`, `800`) — High-contrast monospace glyphs for `CB-XXXX` counter tickets.

---

## 4. Density Philosophy & Contextual Modes

### A. Customer Dining Mode (Spacious & Inviting)
- Generous card padding (`1.25rem – 1.5rem`), prominent food photography, smooth hover scaling, and accessible touch targets ($\ge 44\text{px}$).

### B. Kitchen Operations Mode (High-Density & Tactical)
- Compact ticket cards, high contrast, prominent token headers, clear item quantity callouts (`2×`, `1×`), and immediate 1-click status progression buttons.
