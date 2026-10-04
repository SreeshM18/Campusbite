# CampusBite — Live Presentation & Demo Script (`docs/DEMO_SCRIPT.md`)

**Project Name:** CampusBite — Smart Campus Canteen Pre-Ordering Platform  
**Team Members:**  
- **Sreesh M**  
- **Sreesanth Vishak**  
- **Sanjay**  

**Target Presentation Time:** 5–7 Minutes  

---

## 1. Presentation Introduction (1 Minute)

> **Speaker:**  
> *"Good morning respected evaluators. Today we are excited to present **CampusBite**, a modern full-stack MERN platform engineered to eliminate long lunchtime queues and operational chaos in college food courts.*  
> *CampusBite connects students and faculty to the campus canteen with real-time food discovery, scheduled pickup slots, server-validated pricing, collision-resistant digital tokens, and a dedicated real-time kitchen operations dashboard for canteen chefs."*

---

## 2. Interactive Live Demo Steps (4–5 Minutes)

### Step 1: Student Login & Discovery
1. Open the application at `/login`.
2. Click the **"Student" Quick Demo Login** button (or sign in with `student@campusbite.edu` / `student123`).
3. Point out the human-crafted culinary interface, dietary toggle (`Pure Veg` / `Non-Veg`), and category pills (`BREAKFAST`, `MEALS`, `FAST_FOOD`, `SNACKS`, `BEVERAGES`).
4. Type `"dosa"` or `"biryani"` in the search bar to demonstrate instant live filtering.

### Step 2: Food Tray & Scheduled Pickup
5. Add **Masala Dosa** and **Cold Coffee** to the tray.
6. Open the **Tray Drawer** from the header.
7. Use the **Quantity Stepper** (`- 1 +`) to adjust quantities and show instant subtotal calculation.
8. Click **"Proceed to Checkout"**.
9. Select a scheduled pickup window: **"30 Minutes"** (aligned with campus lecture breaks).
10. Note the **Sandbox UPI Simulation** with dynamic auto-calculated QR code and honest demo disclaimers.

### Step 3: Order Placement & Digital Token Ticket
11. Click **"Authorize Payment & Place Order"**.
12. Show the **Order Confirmation Screen** featuring the perforated **`CB-XXXX` Digital Token Ticket**.
13. Explain that the server authoritatively recalculates prices from MongoDB, preventing client price tampering.

### Step 4: Real-Time Kitchen Operations
14. Open a second browser window (or incognito) and navigate to `/login`.
15. Click **"Kitchen Staff" Demo Login** (`staff@campusbite.edu` / `staff123`).
16. Show the **Staff Kitchen Dashboard (`/staff/orders`)** with 3 operational columns (`PENDING`, `PREPARING`, `READY`).
17. Highlight the incoming student order with its token `CB-XXXX`, item breakdown, and scheduled pickup time.
18. Click **"Start Cooking"** (`PENDING` → `PREPARING`).
19. Switch back to the student window: show that the **Live Order Timeline** dynamically updates to **"Cooking & Packing"**.

### Step 5: Counter Handover & Menu Management
20. In the staff dashboard, click **"Mark Ready for Pickup"** (`PREPARING` → `READY`).
21. Show the emerald ready banner on the student screen instructing them to collect at **Counter #3**.
22. In staff dashboard, click **"Complete Handover"** (`READY` → `COMPLETED`).
23. In student window, navigate to **My Orders (`/orders`)**: show the order moved to **Past Orders** with the **"Order Again"** 1-tap reorder button.
24. Navigate to **Staff Menu Management (`/staff/menu`)**: toggle an item to **"Sold Out"** and show that the student menu disables ordering instantly.

---

## 3. Technical & Security Highlights (1 Minute)

> **Speaker:**  
> *"To ensure enterprise-grade stability and security:*  
> 1. *Authentication uses signed JWTs stored exclusively in **HTTP-Only secure cookies**, shielding against XSS token exfiltration.*  
> 2. *Server authorization is strictly enforced with `protect` and `requireStaff` middleware—students can never access staff queues or mutate catalog prices.*  
> 3. *Passwords are hashed using bcrypt with salt rounds of 10, and `passwordHash` is excluded at the database model level.*  
> 4. *The platform is 100% responsive from 360px mobile phones to 1920px ultrawide displays, with full WCAG 2.1 AA keyboard and contrast accessibility."*

---

## 4. Conclusion & Q&A

> *"Thank you. We welcome any questions regarding the architecture, security model, or codebase implementation."*
