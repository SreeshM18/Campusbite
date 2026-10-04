# CampusBite Architectural & UX Redesign Decisions

## 1. Summary of Transformational Upgrades
This document records the design and engineering rationale behind transforming CampusBite from a fragmented Java/Servlet/LocalStorage student project into a human-crafted, production-grade MERN platform.

---

## 2. Redesign Decision Log

### Decision 01: Food Card Architecture & Inline Quantity Stepper
- **OLD**: Static cards with generic buttons; required multiple clicks and full page reloads to adjust item quantities.
- **PROBLEM**: Cluttered interface, sluggish feedback, high ordering friction during busy lunch breaks.
- **NEW**: Compact culinary card featuring crisp local food photography, preparation time pill (`5 mins prep`), pure veg/non-veg icon, and dynamic inline `- 1 +` quantity stepper upon initial click.
- **WHY**: Reduces cognitive load and ordering friction, allowing students to order a full meal in under 15 seconds.

### Decision 02: High-Visibility Pickup Token System (`CB-XXXX`)
- **OLD**: Tiny random JavaScript integers hidden in alert modals.
- **PROBLEM**: Unreadable from counter distance; easily lost on page refresh; prone to pickup disputes.
- **NEW**: Prominent `CB-XXXX` token in high-contrast `Space Mono` typography with dashed borders, pickup window indicator, and clear counter instructions (`Counter #3`).
- **WHY**: Enables canteen staff to identify student orders from 5–10 feet away across crowded dining hall counters.

### Decision 03: Kitchen Staff Command Dashboard (Digital Tickets)
- **OLD**: Broken HTML table attempting to read unauthenticated client `localStorage`.
- **PROBLEM**: Dual-system conflict; non-staff could access admin pages; no real-time status progression.
- **NEW**: Dedicated high-density Kitchen Queue dashboard with live operational counters (`Pending`, `Cooking`, `Ready`, `Collected`, `Revenue`) and actionable digital kitchen tickets (`Start Cooking`, `Mark Ready`, `Complete Pickup`).
- **WHY**: Streamlines kitchen workflow, eliminates duplicate paper chits, and enforces valid state transitions.

### Decision 04: Mobile Sticky Tray Bar & Drawer Architecture
- **OLD**: Floating circle button blocking food cards on mobile screens.
- **PROBLEM**: Poor touch ergonomics, accidental clicks, obscured menu descriptions.
- **NEW**: Smooth bottom-anchored sticky bar (`(1) View Food Tray  ₹60 →`) paired with a slide-out drawer featuring a built-in pickup scheduler.
- **WHY**: Follows modern thumb-zone ergonomics and ensures students always know their total before entering checkout.

### Decision 05: Public Role Selection Removal
- **OLD**: `register.html` had a dropdown allowing anyone to register directly as `CANTEEN_STAFF`.
- **PROBLEM**: Severe privilege escalation vulnerability.
- **NEW**: Public registration is strictly limited to `STUDENT` and `FACULTY`. Staff accounts are provisioned via backend seed or administrative invitation.
- **WHY**: Protects kitchen order queues and menu pricing controls from unauthorized student manipulation.
