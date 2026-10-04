# CampusBite Master Design System Specification (v2.0)

## 1. Brand Identity & Personality
- **Name**: CampusBite
- **Core Positioning**: *Smart Campus Canteen Pre-Ordering Platform*
- **Value Proposition**: *"Order before your break. Pick up without waiting."*
- **Brand Personality**: Warm, Energetic, Fresh, Young, Helpful, Efficient, Friendly, and Reliable.
- **Anti-Patterns**: Avoid generic red/yellow delivery app clones (Swiggy/Zomato), delivery scooters, driver tracking, and heavy map metaphors. CampusBite is designed specifically for high-throughput **express on-campus counter pickup**.

---

## 2. Color System & Semantic Tokens

### 2.1 Brand Palette (Warm Culinary Amber Orange)
| Token Scale | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| `--brand-50` | `#fff8f1` | Subtle container backgrounds, selected tab fills |
| `--brand-100` | `#feecd6` | Light badges, alert fills, token badge container |
| `--brand-200` | `#fdd4aa` | Light border accents |
| `--brand-300` | `#fbb373` | Active highlight borders |
| `--brand-400` | `#f88b39` | Hover highlight accents |
| `--brand-500` | `#e65100` | **Primary Brand Orange** (CTAs, active tabs, brand logo) |
| `--brand-600` | `#c64200` | Primary button hover state |
| `--brand-700` | `#a33400` | Primary button active/pressed state |
| `--brand-800` | `#812a03` | Dark contrast text on amber surfaces |
| `--brand-900` | `#682406` | Deep brand shade |
| `--brand-950` | `#381001` | Deepest brand accent |

### 2.2 Charcoal Slate Neutrals
| Token Scale | Hex Value | Usage |
| :--- | :--- | :--- |
| `--slate-50` | `#f8f9fa` | Light background variant |
| `--slate-100` | `#f1f3f5` | Subtle chip background |
| `--slate-200` | `#e5e7eb` | Light borders and dividers |
| `--slate-300` | `#d1d5db` | Inactive control borders |
| `--slate-400` | `#9ca3af` | Placeholder and subtle icons |
| `--slate-500` | `#6b7280` | Muted captions and secondary icons |
| `--slate-600` | `#4b5563` | Completed status badge |
| `--slate-700` | `#374151` | Dark neutral controls |
| `--slate-800` | `#272d3b` | Secondary buttons, headers |
| `--slate-900` | `#1b1f2b` | Footer background, dark modal surfaces |

### 2.3 Canvas & Surfaces
| Semantic Token | Hex Value | Role |
| :--- | :--- | :--- |
| `--color-canvas` | `#f8f6f2` | Soft warm cream page background |
| `--color-surface` | `#ffffff` | Primary card, modal, and drawer surfaces |
| `--color-surface-subtle`| `#f1ede6` | Grouped panels, table header fills |
| `--color-surface-muted` | `#e9e3d8` | Skeleton shimmer base |
| `--color-surface-dark` | `#1b1f2b` | Dark footer & kitchen dashboard surface |
| `--color-border` | `#e6e0d6` | Standard structural borders |
| `--color-border-subtle` | `#efeae2` | Subtle dividers and nested borders |
| `--color-border-strong` | `#c8c0b2` | Active input and card hover borders |
| `--color-focus` | `#e65100` | Universal keyboard focus ring outline |

### 2.4 Dietary & Order Status Semantics
| Semantic State | Color Token | Hex Value | Indicator Geometry & Icon |
| :--- | :--- | :--- | :--- |
| **Pure Veg** | `--color-veg` | `#2e7d32` | Green Square + Center Circle Dot |
| **Non-Veg** | `--color-nonveg` | `#c62828` | Red Square + Center Triangle Dot |
| **Order Placed** | `--color-status-pending` | `#d97706` | Amber pill + `Clock` icon |
| **Preparing** | `--color-status-preparing`| `#2563eb` | Blue pill + `ChefHat` icon |
| **Ready for Pickup** | `--color-status-ready` | `#16a34a` | Green pill + `CheckCircle2` icon |
| **Completed** | `--color-status-completed`| `#4b5563` | Slate pill + `Archive` icon |
| **Cancelled** | `--color-status-cancelled`| `#dc2626` | Red pill + `XCircle` icon |

---

## 3. Typography Matrix

| Role | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | Outfit | `2.75rem` (`44px`) | 800 | 1.15 | `-0.025em` |
| **Page Title (H1)** | Outfit | `2.15rem` (`34px`) | 800 | 1.20 | `-0.020em` |
| **Section Title (H2)**| Outfit | `1.65rem` (`26px`) | 700 | 1.25 | `-0.015em` |
| **Card Title (H3)** | Outfit | `1.25rem` (`20px`) | 700 | 1.30 | `-0.010em` |
| **Body Large** | Plus Jakarta Sans | `1.05rem` (`17px`) | 400 | 1.60 | `0` |
| **Body Regular** | Plus Jakarta Sans | `0.925rem` (`15px`)| 400 | 1.55 | `0` |
| **Body Small** | Plus Jakarta Sans | `0.825rem` (`13px`)| 400 | 1.50 | `0` |
| **UI Label** | Outfit | `0.75rem` (`12px`) | 700 | 1.00 | `+0.060em` |
| **Price Tag** | Outfit (Tabular) | `1.25rem` (`20px`) | 800 | 1.00 | `0` |
| **Pickup Token** | Space Mono | `1.85rem` (`30px`) | 700 | 1.00 | `+0.080em` |

---

## 4. Spacing, Radii & Elevations

### 4.1 Spacing Scale (4px Base Grid)
- `var(--space-0_5)`: `2px`
- `var(--space-1)`: `4px`
- `var(--space-2)`: `8px`
- `var(--space-3)`: `12px`
- `var(--space-4)`: `16px`
- `var(--space-5)`: `20px`
- `var(--space-6)`: `24px`
- `var(--space-8)`: `32px`
- `var(--space-10)`: `40px`
- `var(--space-12)`: `48px`
- `var(--space-16)`: `64px`
- `var(--space-20)`: `80px`

### 4.2 Radius Scale
- `xs`: `4px` (Inputs, dietary icons)
- `sm`: `6px` (Small buttons, chips)
- `md`: `8px` (Standard buttons, inputs, toast items)
- `lg`: `12px` (Cards, logo box, token containers)
- `xl`: `16px` (Modals, drawers, hero cards)
- `2xl`: `20px` (Large promotional banners)
- `full`: `9999px` (Pill badges, avatars, round buttons)

### 4.3 Shadow & Elevation Scale
- `shadow-xs`: `0 1px 2px rgba(27, 31, 43, 0.04)`
- `shadow-sm`: `0 1px 3px rgba(27, 31, 43, 0.06), 0 1px 2px rgba(27, 31, 43, 0.04)`
- `shadow-md`: `0 4px 14px rgba(27, 31, 43, 0.08)`
- `shadow-lg`: `0 10px 28px rgba(27, 31, 43, 0.12)`
- `shadow-xl`: `0 20px 40px rgba(27, 31, 43, 0.16)`
- `shadow-warm`: `0 8px 24px rgba(230, 81, 0, 0.24)`

---

## 5. UI Foundation Primitives

The core primitives located in `client/src/components/ui/` provide the universal building blocks for all CampusBite screens:

1. **`Button`**: Supports `primary`, `secondary`, `outline`, `ghost`, `danger` variants across `sm`, `md`, `lg` sizes with loading spinners, icon placement, and disabled states.
2. **`IconButton`**: Dedicated accessible square/circle/rounded icon buttons with tooltips and ARIA support.
3. **`TextField`**: Accessible input with floating/stacked label, required asterisk, helper/error text, and leading/trailing icons.
4. **`PasswordField`**: Accessible password input with integrated Show/Hide toggle (Eye/EyeOff) and keyboard navigation.
5. **`Select`**: Accessible dropdown wrapper with custom chevron arrow and validation feedback.
6. **`Checkbox` & `Radio`**: Custom styled accessible inputs with `44px+` touch targets.
7. **`Badge`**: Compact semantic tags (`neutral`, `brand`, `success`, `warning`, `danger`, `info`).
8. **`StatusBadge`**: Universal order lifecycle badge automatically displaying the canonical status label, color, and Lucide icon.
9. **`FoodTypeIndicator`**: Authentic green circle / red triangle dietary badge with screen-reader accessibility.
10. **`Spinner` & `Skeleton`**: Inline/center loaders and shimmer placeholder skeletons with reduced-motion overrides.
11. **`ToastProvider` & `useToast`**: Context-driven notification system with success, error, warning, and info notifications, responsive bottom positioning, and safe-area offsets.
12. **`Modal`**: Accessible dialog primitive with focus trap, ESC key dismissal, and backdrop blur.
13. **`Drawer`**: Off-canvas slide-in side drawer with scroll lock and backdrop click dismissal.
14. **`PageContainer`**: Standard layout container enforcing widths (`narrow`: 840px, `standard`: 1240px, `wide`: 1400px, `form`: 480px) and responsive gutters.
15. **`PageHeader`**: Standardized page title header with eyebrow, description, and action button slot.
16. **`EmptyState`**: Reusable empty state with icon, title, description, and action button.
17. **`ErrorBoundary`**: Global React error boundary catching runtime exceptions and providing a friendly recovery UI.

---

## 6. Layout Anchors & Responsive Rules

| Viewport | Device Class | Container Max-Width | Gutter Padding |
| :--- | :--- | :--- | :--- |
| **360px – 430px** | Mobile Devices (iPhone SE to 15 Pro Max) | `100%` | `16px` |
| **768px – 1023px** | Tablet Portrait (iPad, Surface) | `100%` | `24px` |
| **1024px – 1279px** | Small Desktop / Tablet Landscape | `1240px` | `32px` |
| **1280px – 1440px** | Standard Desktop Monitor | `1240px` / `1400px` | `32px` |
| **1920px+** | Wide Desktop Monitor | `1240px` / `1400px` centered | `40px` |

---

## 7. Accessibility & Motion Standards
- **Contrast**: All text tokens strictly comply with WCAG 2.1 AA contrast standards (minimum `4.5:1` on text, `3:1` on large headings).
- **Touch Target**: All interactive controls satisfy a minimum `44px × 44px` touch bounding box.
- **Focus Rings**: Universal `:focus-visible` ring using `--color-focus` (`#e65100`) with `2px` offset.
- **Reduced Motion**: All animations automatically drop to `0.01ms` when `@media (prefers-reduced-motion: reduce)` is detected.
