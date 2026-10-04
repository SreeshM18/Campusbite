# CAMPUSBITE — FUTURE ROADMAP & POST-V1 VISION

## 1. Overview
CampusBite v1.0.0 delivers a complete, production-hardened MERN food pre-ordering and kitchen operations platform. All core student and staff workflows (menu discovery across 114+ dishes, customizable pickup scheduling, server-authoritative pricing, digital tokens, real-time post-order tracking, live staff queue, menu management, and robust role-based security) are complete and certified.

This document records high-value future enhancements and expansion opportunities planned for subsequent releases (v1.1+ and beyond).

---

## 2. Post-v1 Capability Roadmap

### Milestone v1.1 — Real-time Push & Live Sockets
* **WebSockets / Server-Sent Events (SSE):** Upgrade from lightweight smart polling (10s–15s) to bidirectional persistent socket streams for instant, zero-latency kitchen queue synchronization and status broadcasts.
* **Audio Notifications in Kitchen:** Audio chimes (configurable bell/beep) when a new high-priority order ticket arrives in the staff queue.
* **Web Push Notifications:** Browser Push API alerts to students when their order status transitions to `READY for Pickup`.

### Milestone v1.2 — Commercial Payment Gateway Integration
* **Razorpay / Stripe Production Integration:** Direct payment gateway webhooks for real UPI apps (GPay, PhonePe, Paytm, BHIM) and credit/debit cards, complementing the existing sandbox simulator.
* **Campus ID / Smart Card Balance:** Integration with college RFID smart card payment systems for automated student stipend deduction.

### Milestone v1.3 — Progressive Web App (PWA) & Offline Shell
* **Service Worker Caching:** Offline menu catalog browsing and cached token rendering via Workbox.
* **Add to Home Screen (A2HS):** Standalone app manifest with branded splash screen, adaptive icons, and offline status indicator.

### Milestone v1.4 — Multi-Counter & Food Court Multi-Tenancy
* **Multiple Canteen / Counter Support:** Support for distinct counters (e.g. Counter #1 South Indian, Counter #2 Indo-Chinese, Counter #3 Juices & Bakery) with discrete kitchen queues and split order routing.
* **Vendor Sub-Accounts:** Role-based counter staff permissions restricted to their specific counter's menu items.

### Milestone v1.5 — Advanced Nutrition & Allergen Intelligence
* **Allergen Badges:** Explicit dietary tags for Gluten-Free, Dairy-Free, Nut-Free, Jain-Friendly, and Vegan.
* **Calorie & Macro Breakdown:** Estimated calories, protein, carbohydrates, and healthy fat counts per dish for health-conscious students.

### Milestone v1.6 — Operational Intelligence & Analytics
* **Kitchen Rush Forecasting:** Machine learning / statistical model forecasting rush periods based on college timetable breaks and historical peak traffic.
* **Daily Sales & Waste Export:** CSV/Excel export of daily revenue, top-selling dishes, preparation latency averages, and inventory velocity.

---

## 3. Architecture & Upgrade Principles
1. **Zero Breaking Changes:** Future modules will build upon MongoDB schemas via additive fields and non-destructive migrations.
2. **Server Price & State Authority:** Server-side price calculation, token uniqueness, and role authorization will remain strictly enforced on Express/MongoDB regardless of client platform additions.
3. **Vanilla CSS Token Preservation:** The human-crafted CSS design system (`tokens.css`, `typography.css`, `utilities.css`, `global.css`) will remain the unified design standard.
