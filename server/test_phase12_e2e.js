import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from './src/models/User.js';
import { MenuItem } from './src/models/MenuItem.js';
import { Order } from './src/models/Order.js';
import app from './src/app.js';

let mongod;
let server;
const PORT = 5198;
const BASE_URL = `http://localhost:${PORT}/api`;

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
};

const getCookie = (res) => {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return null;
  const match = setCookie.match(/token=[^;]+/);
  return match ? match[0] : null;
};

const runPhase12FullSystemQA = async () => {
  try {
    console.log('========================================================================');
    console.log('   CAMPUSBITE PHASE 12: FULL SYSTEM END-TO-END QA & VERIFICATION');
    console.log('========================================================================\n');

    // 1. Setup in-memory MongoDB and test HTTP server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✓ In-memory MongoDB online:', uri);

    server = app.listen(PORT, () => {
      console.log(`✓ Test HTTP Server active on ${BASE_URL}\n`);
    });

    // =========================================================================
    // 1. FRESH STUDENT REGISTRATION, AUTHENTICATION & PROFILE FLOW
    // =========================================================================
    console.log('--- 1. Full Student Authentication & Profile Flow ---');

    // 1.1 Fresh Student Registration
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Sharma',
        email: 'rohan.sharma@campusbite.edu',
        password: 'RohanPassword2026!',
        role: 'STUDENT'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Fresh student registration returns 201 Created');
    assert(regData.user.name === 'Rohan Sharma', 'User name stored accurately');
    assert(regData.user.role === 'STUDENT', 'User role assigned as STUDENT');
    assert(regData.user.passwordHash === undefined, 'passwordHash strictly omitted from registration response');
    const rohanCookie = getCookie(regRes);
    assert(rohanCookie !== null, 'HTTP-only auth cookie issued upon registration');

    // 1.2 Session Restoration
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: rohanCookie }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'Session restoration GET /api/auth/me returns 200 OK');
    assert(meData.user.email === 'rohan.sharma@campusbite.edu', 'Session identifies correct student profile');

    // 1.3 Profile Update (Whitelisted Name Edit)
    const profileUpdateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: rohanCookie
      },
      body: JSON.stringify({
        name: 'Rohan Sharma (CS Dept)'
      })
    });
    const profileUpdateData = await profileUpdateRes.json();
    assert(profileUpdateRes.status === 200, 'Profile name update returns 200 OK');
    assert(profileUpdateData.user.name === 'Rohan Sharma (CS Dept)', 'Name change reflected immediately');

    // 1.4 Password Change & Re-Authentication Verification
    const pwChangeRes = await fetch(`${BASE_URL}/auth/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: rohanCookie
      },
      body: JSON.stringify({
        currentPassword: 'RohanPassword2026!',
        newPassword: 'RohanUpdatedPassword2026!'
      })
    });
    assert(pwChangeRes.status === 200, 'Password changed successfully with current password verification');

    // Re-login with updated password
    const reLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rohan.sharma@campusbite.edu',
        password: 'RohanUpdatedPassword2026!'
      })
    });
    assert(reLoginRes.status === 200, 'Login with updated password succeeds (200 OK)');
    const rohanActiveCookie = getCookie(reLoginRes);

    // =========================================================================
    // 2. MENU DISCOVERY, ADVANCED SEARCH & FILTER QA
    // =========================================================================
    console.log('\n--- 2. Menu Discovery, Search & Category Filters QA ---');

    // Seed Menu Items across categories
    const menuSeed = [
      { name: 'Masala Dosa', description: 'Crispy rice crepe with potato masala', price: 60, category: 'BREAKFAST', subcategory: 'South Indian', foodType: 'VEG', available: true, preparationTime: 10 },
      { name: 'Chicken Dum Biryani', description: 'Hyderabadi spiced basmati rice with chicken', price: 160, category: 'MEALS', subcategory: 'Rice & Biryani', foodType: 'NON_VEG', available: true, preparationTime: 15 },
      { name: 'Veg Hakka Noodles', description: 'Wok-tossed noodles with crunchy veggies', price: 90, category: 'FAST_FOOD', subcategory: 'Chinese', foodType: 'VEG', available: true, preparationTime: 12 },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese cubes in rich tomato gravy', price: 130, category: 'MEALS', subcategory: 'Curries', foodType: 'VEG', available: true, preparationTime: 15 },
      { name: 'Cold Coffee with Ice Cream', description: 'Creamy chilled espresso topped with vanilla scoop', price: 70, category: 'BEVERAGES', subcategory: 'Cold Drinks', foodType: 'VEG', available: true, preparationTime: 5 },
      { name: 'Chicken Roll', description: 'Flaky paratha rolled with roasted spiced chicken', price: 95, category: 'SNACKS', subcategory: 'Rolls & Wraps', foodType: 'NON_VEG', available: false, preparationTime: 10 } // Sold Out
    ];

    const insertedItems = await MenuItem.insertMany(menuSeed);
    assert(insertedItems.length === 6, 'Menu seeded with 6 diverse dishes across 5 categories');

    const dosaItem = insertedItems.find((i) => i.name === 'Masala Dosa');
    const biryaniItem = insertedItems.find((i) => i.name === 'Chicken Dum Biryani');
    const soldOutRoll = insertedItems.find((i) => i.name === 'Chicken Roll');

    // 2.1 Full Catalog Fetch
    const menuFetchRes = await fetch(`${BASE_URL}/menu`);
    const menuFetchData = await menuFetchRes.json();
    assert(menuFetchRes.status === 200, 'Public GET /api/menu returns 200 OK');
    assert(menuFetchData.data.length === 6, 'All active menu items retrieved');

    // 2.2 Category Filtering
    const breakfastRes = await fetch(`${BASE_URL}/menu?category=BREAKFAST`);
    const breakfastData = await breakfastRes.json();
    assert(breakfastData.data.length === 1 && breakfastData.data[0].name === 'Masala Dosa', 'Category filter BREAKFAST correctly isolates Masala Dosa');

    // 2.3 Veg / Non-Veg Filtering
    const vegRes = await fetch(`${BASE_URL}/menu?foodType=VEG`);
    const vegData = await vegRes.json();
    assert(vegData.data.every((item) => item.foodType === 'VEG'), 'Dietary filter VEG returns exclusively vegetarian dishes');

    // 2.4 Multi-word & Partial Search Queries
    const searchRes = await fetch(`${BASE_URL}/menu?search=biryani`);
    const searchData = await searchRes.json();
    assert(searchData.data.length === 1 && searchData.data[0].name.includes('Biryani'), 'Search "biryani" finds Chicken Dum Biryani');

    // 2.5 Case-Insensitive & Whitespace Search Query
    const searchCaseRes = await fetch(`${BASE_URL}/menu?search=%20%20CoFfEe%20%20`);
    const searchCaseData = await searchCaseRes.json();
    assert(searchCaseData.data.length === 1 && searchCaseData.data[0].name.includes('Coffee'), 'Case-insensitive whitespace search finds Cold Coffee');

    // 2.6 Combined Filter (Meals + Veg)
    const comboRes = await fetch(`${BASE_URL}/menu?category=MEALS&foodType=VEG`);
    const comboData = await comboRes.json();
    assert(comboData.data.length === 1 && comboData.data[0].name === 'Paneer Butter Masala', 'Combined filter MEALS + VEG isolates Paneer Butter Masala');

    // =========================================================================
    // 3. CART, CHECKOUT, PICKUP & SERVER-AUTHORITATIVE PRICING
    // =========================================================================
    console.log('\n--- 3. Cart, Server Price Authority & Checkout Flow ---');

    // 3.1 Attempting to order a Sold-Out item must be rejected
    const soldOutOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: rohanActiveCookie
      },
      body: JSON.stringify({
        items: [{ menuItemId: soldOutRoll._id.toString(), quantity: 1 }],
        pickupType: 'immediate',
        pickupTime: '1:15 PM',
        paymentMethod: 'UPI'
      })
    });
    const soldOutOrderData = await soldOutOrderRes.json();
    assert(soldOutOrderRes.status === 400, 'Ordering sold-out dish is strictly rejected with 400 Bad Request');
    assert(soldOutOrderData.message.includes('sold out'), 'Sold-out rejection contains descriptive error message');

    // 3.2 Client Price Tampering Defense: Client attempts fake price of ₹10 (Actual: Dosa ₹60 + Biryani ₹160 = ₹220)
    const validOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: rohanActiveCookie
      },
      body: JSON.stringify({
        items: [
          { menuItemId: dosaItem._id.toString(), quantity: 1, price: 5 }, // Client fake price
          { menuItemId: biryaniItem._id.toString(), quantity: 1, price: 5 } // Client fake price
        ],
        subtotal: 10, // Client fake subtotal
        pickupType: 'scheduled',
        pickupTime: '1:30 PM (In 30 mins)',
        paymentMethod: 'UPI',
        specialInstructions: 'Please make dosa extra crispy and serve with extra sambar.'
      })
    });
    const validOrderData = await validOrderRes.json();
    assert(validOrderRes.status === 201, 'Order created successfully (201 Created)');
    assert(validOrderData.data.subtotal === 220, 'SERVER PRICE AUTHORITY: Subtotal recalculated authoritatively from DB (₹220, ignoring client ₹10)');
    assert(validOrderData.data.token && validOrderData.data.token.startsWith('CB-'), `Collision-free token generated: ${validOrderData.data.token}`);
    assert(validOrderData.data.status === 'PENDING', 'Initial order status is PENDING');
    assert(validOrderData.data.pickupTime === '1:30 PM (In 30 mins)', 'Scheduled pickup time recorded');

    const rohanOrderId = validOrderData.data._id;

    // 3.3 Verify Student My Orders History
    const myOrdersRes = await fetch(`${BASE_URL}/orders/my`, {
      headers: { Cookie: rohanActiveCookie }
    });
    const myOrdersData = await myOrdersRes.json();
    assert(myOrdersRes.status === 200, 'GET /api/orders/my returns 200 OK');
    assert(myOrdersData.data.length === 1, 'Student order history contains placed order');
    assert(myOrdersData.activeCount === 1, 'Active order count is 1');
    assert(myOrdersData.data[0]._id === rohanOrderId, 'Order ID matches in history');

    // =========================================================================
    // 4. STAFF KITCHEN OPERATIONS, QUEUE & STATUS TRANSITIONS
    // =========================================================================
    console.log('\n--- 4. Staff Kitchen Queue & Real-Time Status Lifecycle ---');

    // Provision Staff User
    const salt = await bcrypt.genSalt(10);
    const staffUser = await User.create({
      name: 'Chef Govind (Master Chef)',
      email: 'chef.govind@campusbite.edu',
      passwordHash: await bcrypt.hash('StaffPassword2026', salt),
      role: 'CANTEEN_STAFF',
      isActive: true
    });

    const staffLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'chef.govind@campusbite.edu',
        password: 'StaffPassword2026'
      })
    });
    const staffCookie = getCookie(staffLoginRes);
    assert(staffCookie !== null, 'Staff logged in and received staff cookie');

    // 4.1 Staff Queries Live Kitchen Queue
    const staffQueueRes = await fetch(`${BASE_URL}/orders/staff/all`, {
      headers: { Cookie: staffCookie }
    });
    const staffQueueData = await staffQueueRes.json();
    assert(staffQueueRes.status === 200, 'Staff retrieves kitchen queue with 200 OK');
    const orderInQueue = staffQueueData.data.find((o) => o._id === rohanOrderId);
    assert(orderInQueue !== undefined, 'Rohan order is visible in staff queue');
    assert(orderInQueue.items.length === 2, 'All 2 items listed with correct quantities');

    // 4.2 Status Transition 1: PENDING -> PREPARING (Cooking)
    const prepStatusRes = await fetch(`${BASE_URL}/orders/${rohanOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: staffCookie
      },
      body: JSON.stringify({ status: 'PREPARING' })
    });
    const prepStatusData = await prepStatusRes.json();
    assert(prepStatusRes.status === 200, 'Staff updates status to PREPARING (200 OK)');
    assert(prepStatusData.data.status === 'PREPARING', 'Order state updated to PREPARING');

    // Verify Student sees PREPARING on order tracking
    const studentTrackRes1 = await fetch(`${BASE_URL}/orders/${rohanOrderId}`, {
      headers: { Cookie: rohanActiveCookie }
    });
    const studentTrackData1 = await studentTrackRes1.json();
    assert(studentTrackData1.data.status === 'PREPARING', 'Customer order detail reflects PREPARING status');

    // Customer cancellation should now be BLOCKED because cooking started
    const cancelAttemptRes = await fetch(`${BASE_URL}/orders/${rohanOrderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: rohanActiveCookie
      },
      body: JSON.stringify({ reason: 'Changed my mind' })
    });
    assert(cancelAttemptRes.status === 400, 'Customer cancellation BLOCKED once cooking has commenced');

    // 4.3 Status Transition 2: PREPARING -> READY (Food Packed at Counter #3)
    const readyStatusRes = await fetch(`${BASE_URL}/orders/${rohanOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: staffCookie
      },
      body: JSON.stringify({ status: 'READY' })
    });
    assert(readyStatusRes.status === 200, 'Staff updates status to READY (200 OK)');

    // 4.4 Status Transition 3: READY -> COMPLETED (Handed Over)
    const completedStatusRes = await fetch(`${BASE_URL}/orders/${rohanOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: staffCookie
      },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    assert(completedStatusRes.status === 200, 'Staff updates status to COMPLETED (200 OK)');

    // 4.5 Verify Customer My Orders reflects Completed state
    const myOrdersAfterRes = await fetch(`${BASE_URL}/orders/my`, {
      headers: { Cookie: rohanActiveCookie }
    });
    const myOrdersAfterData = await myOrdersAfterRes.json();
    assert(myOrdersAfterData.activeCount === 0, 'Active order count is now 0');
    assert(myOrdersAfterData.pastCount === 1, 'Past order count is now 1');
    assert(myOrdersAfterData.data[0].status === 'COMPLETED', 'Order status is COMPLETED');

    // =========================================================================
    // 5. STAFF MENU MANAGEMENT & LIVE CUSTOMER SYNC
    // =========================================================================
    console.log('\n--- 5. Staff Menu Management & Live Synchronization ---');

    // 5.1 Staff Adds New Food Item
    const addDishRes = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: staffCookie
      },
      body: JSON.stringify({
        name: 'Paneer Tikka Roll',
        description: 'Smoky tandoori paneer wrapped in flaky whole wheat paratha',
        price: 110,
        category: 'SNACKS',
        subcategory: 'Rolls & Wraps',
        foodType: 'VEG',
        available: true,
        preparationTime: 8
      })
    });
    const addDishData = await addDishRes.json();
    assert(addDishRes.status === 201, 'Staff creates new dish: Paneer Tikka Roll (201 Created)');
    const newDishId = addDishData.data._id;

    // 5.2 Verify Dish Appears in Public Customer Menu
    const pubMenuCheck = await fetch(`${BASE_URL}/menu?search=Paneer%20Tikka%20Roll`);
    const pubMenuCheckData = await pubMenuCheck.json();
    assert(pubMenuCheckData.data.length === 1 && pubMenuCheckData.data[0].price === 110, 'New dish immediately visible to students at ₹110');

    // 5.3 Staff Updates Price to ₹125
    const editDishRes = await fetch(`${BASE_URL}/menu/${newDishId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: staffCookie
      },
      body: JSON.stringify({ price: 125 })
    });
    assert(editDishRes.status === 200, 'Staff updates price to ₹125 (200 OK)');

    // 5.4 Customer Menu Sync Check
    const pubMenuUpdated = await fetch(`${BASE_URL}/menu?search=Paneer%20Tikka%20Roll`);
    const pubMenuUpdatedData = await pubMenuUpdated.json();
    assert(pubMenuUpdatedData.data[0].price === 125, 'Customer menu reflects updated price ₹125');

    // 5.5 Historical Order Verification: Rohan old order receipt retains original prices
    const histOrderCheck = await fetch(`${BASE_URL}/orders/${rohanOrderId}`, {
      headers: { Cookie: rohanActiveCookie }
    });
    const histOrderData = await histOrderCheck.json();
    assert(histOrderData.data.subtotal === 220, 'HISTORICAL DATA INTEGRITY: Past order subtotal unchanged at ₹220');

    // =========================================================================
    // 6. CROSS-USER AUTHORIZATION & SECURITY QA
    // =========================================================================
    console.log('\n--- 6. Cross-User Authorization & Security Boundaries ---');

    // Register Student B
    const s2RegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Patel',
        email: 'priya.patel@campusbite.edu',
        password: 'PriyaPassword2026!',
        role: 'STUDENT'
      })
    });
    const priyaCookie = getCookie(s2RegRes);

    // Student B attempts to read Student A's order -> 403 Forbidden
    const idorRes = await fetch(`${BASE_URL}/orders/${rohanOrderId}`, {
      headers: { Cookie: priyaCookie }
    });
    assert(idorRes.status === 403, 'IDOR PROTECTION: Student B attempting to view Student A order is blocked with 403 Forbidden');

    // Student attempts to access staff menu route -> 403 Forbidden
    const studentMenuMutateRes = await fetch(`${BASE_URL}/menu/${newDishId}`, {
      method: 'DELETE',
      headers: { Cookie: priyaCookie }
    });
    assert(studentMenuMutateRes.status === 403, 'RBAC PROTECTION: Student attempting to delete menu item is blocked with 403 Forbidden');

    // Malformed MongoDB ID check
    const badIdRes = await fetch(`${BASE_URL}/orders/invalid-mongo-id-format`, {
      headers: { Cookie: rohanActiveCookie }
    });
    assert(badIdRes.status === 400, 'MALFORMED ID DEFENSE: Bad ObjectId returns clean 400 Bad Request instead of internal crash');

    // =========================================================================
    // 7. SECURITY HEADERS & HEALTH API
    // =========================================================================
    console.log('\n--- 7. Security Headers & System Health ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'Health endpoint returns 200 OK');
    assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'Helmet X-Content-Type-Options: nosniff verified');
    assert(healthRes.headers.get('x-frame-options') !== null, 'Helmet X-Frame-Options clickjacking protection verified');

    console.log('\n========================================================================');
    console.log('   🎉 ALL PHASE 12 FULL-SYSTEM QA TESTS PASSED WITH 100% SUCCESS!');
    console.log('========================================================================\n');
  } catch (error) {
    console.error('\n❌ PHASE 12 QA TEST FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
};

runPhase12FullSystemQA();
