# CampusBite Master UI Component Inventory

## 1. Core UI Primitives (`client/src/components/ui/`)

| Component | Purpose | Variants / Props | Accessibility & Standards |
| :--- | :--- | :--- | :--- |
| **`Button`** | Primary interactive action trigger | Variants: `primary`, `secondary`, `tertiary`/`outline`, `ghost`, `danger`. Sizes: `sm`, `md`, `lg`. Supports `loading`, `disabled`, `fullWidth`, `iconBefore`, `iconAfter`. | Focus ring `:focus-visible`, `aria-busy` when loading, touch target ≥ 44px on mobile. |
| **`IconButton`** | Compact icon button for quick actions | Variants: `ghost`, `outline`, `primary`, `danger`. Shapes: `rounded`, `circle`, `square`. Sizes: `sm`, `md`, `lg`. | Mandatory `aria-label` or `title`, accessible focus indicator. |
| **`TextField`** | Standard textual input primitive | Props: `label`, `required`, `helper`, `error`, `leadingIcon`, `trailingIcon`, `disabled`, `readOnly`. | `aria-invalid`, `aria-describedby` linking helper and error text. |
| **`PasswordField`**| Secure password input with visibility toggle | Integrated show/hide toggle with `Eye` / `EyeOff` icons. | `aria-label="Show password"`, keyboard accessible toggle button. |
| **`Select`** | Accessible dropdown selector wrapper | Custom SVG chevron, stacked label, option mapping, error feedback. | Native form accessibility with enhanced custom styling. |
| **`Checkbox` & `Radio`**| Binary preference and single-select controls | Custom high-contrast check and radio indicators with 44px touch bounding box. | Screen-reader hidden native input with visual pseudo-indicator. |
| **`Badge`** | Compact metadata pill | Variants: `neutral`, `brand`, `success`, `warning`, `danger`, `info`. Sizes: `sm`, `md`, `lg`. | High-contrast WCAG 2.1 AA text colors. |
| **`StatusBadge`** | Universal order lifecycle status indicator | Standardized statuses: `pending`, `preparing`, `ready`, `completed`, `cancelled`. Automatically maps icon, text label, background, and border. | Unified status semantics across customer orders and kitchen dashboard. |
| **`FoodTypeIndicator`**| Authentic Indian dietary classification badge | Veg (Green square + center circle dot) / Non-Veg (Red/Brown square + center triangle dot). Supports `showLabel` and sizes. | `role="img"`, `aria-label="Pure Veg"` or `aria-label="Non-Veg"`. |
| **`Spinner`** | Circular motion loader | Sizes: `sm` (16px), `md` (24px), `lg` (36px), `xl` (48px). Supports label and center wrapper. | `role="status"`, `sr-only` loading text fallback. |
| **`Skeleton`** | Shimmer animated placeholder loader | Variants: `text`, `circular`, `rectangular`, `card`. Shimmer animation with reduced motion fallback. | `aria-hidden="true"` with `role="status"`. |
| **`ToastProvider` & `useToast`**| Global notification alert toast system | Methods: `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`. Desktop bottom-right, mobile bottom-center with safe area padding. | `role="alert"`, auto-dismissal timer, manual dismiss button. |
| **`Modal`** | Accessible dialog overlay | Backdrop blur, body scroll lock, Escape key listener, title, description, actions footer. | `role="dialog"`, `aria-modal="true"`, focus trapping. |
| **`Drawer`** | Slide-in off-canvas panel | Slide from right/left, backdrop dismissal, Escape listener, body scroll lock. | `role="dialog"`, `aria-modal="true"`. |
| **`PageContainer`**| Responsive layout constraint primitive | Max widths: `narrow` (840px), `standard` (1240px), `wide` (1400px), `form` (480px). Viewport gutters: 16px mobile, 24px tablet, 32px desktop, 40px wide. | Prevents accidental wide content stretching. |
| **`PageHeader`** | Standardized page title header | Eyebrow, main title, description, back link, action button slot. | Clean heading hierarchy (`H1`). |
| **`EmptyState`** | Standardized empty result feedback | Icon slot, title, description, and primary CTA button. | Encourages user recovery with 1-click reset actions. |
| **`ErrorBoundary`**| React runtime exception failover | Intercepts rendering crashes, renders friendly CampusBite error screen with reload and home recovery buttons. | Never exposes raw stack traces to end users. |

---

## 2. Menu Discovery Experience Components (`client/src/components/menu/`)

| Component | Purpose | Features & States | Accessibility & Standards |
| :--- | :--- | :--- | :--- |
| **`FoodCard`** | Primary culinary dish card | 4:3 appetizing cover photo, graceful fallback for broken images, authentic `FoodTypeIndicator`, prep time pill, price formatted in bold tabular numbers (`₹120`), 2-line clamped title and description, availability overlay ("Sold Out Today"), and smooth Add-to-Stepper interaction. | `aria-label="Add [Dish] to tray"`, `aria-label="Increase [Dish] quantity"`, `aria-label="Decrease [Dish] quantity"`, full keyboard focusability. |
| **`FoodCardSkeleton`**| Exact geometric shimmer loader for menu grid | Replicates 4:3 image box, title/price row, 2-line description, and action bar during API fetch. | `aria-hidden="true"`, prevents layout shift during load. |
| **`CategoryNav`** | Search, dietary, and category toolbar | Unified search input with instant clear (`X`) and `Escape` support, segmented Pure Veg / Non-Veg / All Diets toggle, horizontal scrollable category tabs (`All`, `Breakfast`, `Meals`, `Snacks`, `Beverages`, `Desserts`), live result counter, and 1-click filter reset. | `role="search"`, `role="tablist"`, `aria-pressed`, `aria-label`. |
| **`MenuPage`** | Main student menu discovery screen | Campus greeting header, express pickup status chip, URL query param synchronization (`?category=...&type=...&search=...`), chef's daily quick picks section, responsive food card grid (1 col mobile, 2 col tablet, 3-4 col desktop), zero-results empty state, and retryable error state. | Full keyboard navigation, deep linking, 0ms instant local filtering. |

---

## 3. Cart & Fulfillment Components (`client/src/components/cart/`)

| Component | Purpose | Variants / States | Where Used |
| :--- | :--- | :--- | :--- |
| **`CartDrawer`** | Slide-out overlay tray showing selected food items, quantity steppers, trash removal, pickup scheduler, and checkout CTA. | Empty tray state, populated tray state, slide-in animation. | Global Drawer (triggered from navbar & cards). |
| **`PickupScheduler`**| Interactive slot selector for immediate or scheduled meal pickup windows with live clock time computation. | Immediate (0-5 min), 15 min, 30 min, 45 min, 1 hour. | `CartDrawer`, `CheckoutPage`. |
| **`StickyMobileCartBar`**| Floating bottom bar on mobile screens alerting student to items in tray with instant checkout shortcut. | Slides in when `itemCount > 0`, hidden on desktop or when empty. Respects `env(safe-area-inset-bottom, 16px)`. | Mobile view of `MenuPage`, `HomePage`. |

---

## 4. App Shell & Layout Components (`client/src/components/common/` & `layout/`)

| Component | Purpose | Variants / States | Where Used |
| :--- | :--- | :--- | :--- |
| **`AppShell`** | Root layout wrapper uniting Header, CartDrawer, StickyMobileCartBar, Main content, Footer, ToastProvider, and ErrorBoundary. | Guest, Student, Staff views. | Root `App.jsx`. |
| **`Navbar`** | Sticky application header with brand logo, menu link, order tracking link, tray trigger button with count badge, and user session avatar. | Guest, Student, Staff, Mobile hamburger menu. | Global header. |
| **`Footer`** | Brand identity, operational canteen hours, campus court location, hygiene certification, and legal credits. | Responsive 4-column desktop, stacked 1-column mobile. | Global footer. |
| **`ProtectedRoute`**| Client-side route guard enforcing user authentication before rendering private customer routes. | Authenticated, Unauthenticated (redirects to `/login`). | `/checkout`, `/orders`, `/orders/:id`. |
| **`StaffRoute`** | Strict RBAC route guard restricting kitchen operations exclusively to `role: CANTEEN_STAFF`. | Authorized Staff, Non-staff (redirects to `/menu`). | `/staff/orders`, `/staff/menu`. |
