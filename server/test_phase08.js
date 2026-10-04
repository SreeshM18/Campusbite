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

const runTests = async () => {
  try {
    console.log('--- Starting CampusBite Phase 08 Automated Verification ---');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✓ Connected to in-memory test database:', uri);

    server = app.listen(5188, () => {
      console.log('✓ Test HTTP Server active on http://localhost:5188');
    });

    const salt = await bcrypt.genSalt(10);
    const studentHash = await bcrypt.hash('student123', salt);
    const staffHash = await bcrypt.hash('staff123', salt);
    const facultyHash = await bcrypt.hash('faculty123', salt);

    const student = await User.create({
      name: 'Alex Rivera (Student)',
      email: 'student@campusbite.edu',
      passwordHash: studentHash,
      role: 'STUDENT'
    });

    const staff = await User.create({
      name: 'Canteen Staff Lead',
      email: 'staff@campusbite.edu',
      passwordHash: staffHash,
      role: 'CANTEEN_STAFF'
    });

    const faculty = await User.create({
      name: 'Dr. Sarah Jenkins (Faculty)',
      email: 'faculty@campusbite.edu',
      passwordHash: facultyHash,
      role: 'FACULTY'
    });

    const secret = process.env.JWT_SECRET || 'campusbite_super_secure_jwt_secret_key_2026_production';
    const studentToken = jwt.sign({ id: student._id }, secret, { expiresIn: '1d' });
    const facultyToken = jwt.sign({ id: faculty._id }, secret, { expiresIn: '1d' });
    const staffToken = jwt.sign({ id: staff._id }, secret, { expiresIn: '1d' });

    console.log('✓ Demo users & JWT credentials initialized');

    // Create test menu items
    const dosa = await MenuItem.create({
      name: 'Crispy Masala Dosa',
      description: 'Golden fermented rice crepe with potato masala and fresh chutneys.',
      image: '/images/masala_dosa.jpg',
      price: 70,
      category: 'BREAKFAST',
      foodType: 'VEG',
      available: true,
      preparationTime: 10
    });

    const coffee = await MenuItem.create({
      name: 'Classic Cold Coffee',
      description: 'Chilled rich blended coffee with milk and chocolate drizzle.',
      image: '/images/cold_coffee.jpg',
      price: 60,
      category: 'BEVERAGES',
      foodType: 'VEG',
      available: true,
      preparationTime: 5
    });

    const puff = await MenuItem.create({
      name: 'Chicken Puff',
      description: 'Flaky baked pastry with spiced shredded chicken.',
      image: '/images/chicken_roll.jpg',
      price: 45,
      category: 'SNACKS',
      foodType: 'NON_VEG',
      available: false, // Sold out
      preparationTime: 5
    });

    console.log('✓ Menu items created (including 1 sold out item)');

    // 1. Create Order as Student
    const orderRes = await fetch('http://localhost:5188/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        items: [
          { menuItemId: dosa._id, quantity: 2 },
          { menuItemId: coffee._id, quantity: 1 }
        ],
        pickupType: '15mins',
        pickupTime: 'In 15 Minutes (Ready around 01:00 PM)',
        paymentMethod: 'UPI',
        specialInstructions: 'Extra spicy chutney'
      })
    });

    const orderData = await orderRes.json();
    if (!orderData.success || !orderData.data.token.startsWith('CB-')) {
      throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`);
    }
    const createdOrder = orderData.data;
    if (createdOrder.subtotal !== (70 * 2 + 60 * 1)) {
      throw new Error(`Incorrect server subtotal calculation: Expected 200, got ${createdOrder.subtotal}`);
    }
    console.log(`✓ Order Created with Strict Server Price Authority: Token = ${createdOrder.token}, Subtotal = ₹${createdOrder.subtotal}`);

    // 2. Fetch My Orders (Student)
    const myOrdersRes = await fetch('http://localhost:5188/api/orders/my', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const myOrdersData = await myOrdersRes.json();
    if (!myOrdersData.success || myOrdersData.data.length === 0 || myOrdersData.activeCount !== 1) {
      throw new Error('Failed to retrieve my orders');
    }
    console.log(`✓ My Orders retrieved: Count = ${myOrdersData.count}, Active = ${myOrdersData.activeCount}, Past = ${myOrdersData.pastCount}`);

    // 3. Security Test: Faculty tries to access Student's Order -> Must return 403
    const forbiddenRes = await fetch(`http://localhost:5188/api/orders/${createdOrder._id}`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    if (forbiddenRes.status !== 403) {
      throw new Error(`Ownership check failed: Expected 403 Forbidden, got ${forbiddenRes.status}`);
    }
    console.log('✓ Security Check: Cross-user access strictly blocked with 403 Forbidden');

    // 4. Owner reads own order -> 200 OK
    const ownerRes = await fetch(`http://localhost:5188/api/orders/${createdOrder._id}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const ownerData = await ownerRes.json();
    if (ownerRes.status !== 200 || ownerData.data.token !== createdOrder.token) {
      throw new Error('Owner failed to read own order');
    }
    console.log(`✓ Order Detail Retrieved: Token = ${ownerData.data.token}, Items = ${ownerData.data.items.length}, Status = ${ownerData.data.status}`);

    // 5. Staff moves status: PENDING -> PREPARING
    const prepRes = await fetch(`http://localhost:5188/api/orders/${createdOrder._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'PREPARING' })
    });
    const prepData = await prepRes.json();
    if (!prepData.success || prepData.data.status !== 'PREPARING' || !prepData.data.preparingAt) {
      throw new Error('Staff update to PREPARING failed');
    }
    console.log('✓ Status Transition: PENDING -> PREPARING (preparingAt server timestamp stored)');

    // 6. Student attempts to cancel PREPARING order -> Must return 400 Bad Request
    const cancelFailRes = await fetch(`http://localhost:5188/api/orders/${createdOrder._id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ reason: 'Changed mind' })
    });
    if (cancelFailRes.status !== 400) {
      throw new Error(`Cancellation guard failed: Expected 400 for PREPARING order, got ${cancelFailRes.status}`);
    }
    console.log('✓ Cancellation Guard: In-flight cooking orders cannot be cancelled by students');

    // 7. Staff moves status: PREPARING -> READY
    const readyRes = await fetch(`http://localhost:5188/api/orders/${createdOrder._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'READY' })
    });
    const readyData = await readyRes.json();
    if (!readyData.success || readyData.data.status !== 'READY' || !readyData.data.readyAt) {
      throw new Error('Staff update to READY failed');
    }
    console.log('✓ Status Transition: PREPARING -> READY (readyAt server timestamp stored)');

    // 8. Staff moves status: READY -> COMPLETED
    const compRes = await fetch(`http://localhost:5188/api/orders/${createdOrder._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    const compData = await compRes.json();
    if (!compData.success || compData.data.status !== 'COMPLETED' || !compData.data.completedAt) {
      throw new Error('Staff update to COMPLETED failed');
    }
    console.log('✓ Status Transition: READY -> COMPLETED (completedAt server timestamp stored)');

    // 9. Create another order to test PENDING cancellation
    const order2Res = await fetch('http://localhost:5188/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        items: [{ menuItemId: dosa._id, quantity: 1 }],
        pickupType: 'immediate',
        pickupTime: 'Immediate (~10 mins)'
      })
    });
    const order2Data = await order2Res.json();
    const order2 = order2Data.data;

    const cancelSuccessRes = await fetch(`http://localhost:5188/api/orders/${order2._id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ reason: 'Lecture ran late' })
    });
    const cancelSuccessData = await cancelSuccessRes.json();
    if (!cancelSuccessData.success || cancelSuccessData.data.status !== 'CANCELLED' || !cancelSuccessData.data.cancelledAt) {
      throw new Error('Pending order cancellation failed');
    }
    console.log(`✓ Cancellation Success: PENDING order #${order2.token} cancelled with stored reason & cancelledAt`);

    // 10. Reorder Validation Test (Simulate Client Reorder Flow)
    const completedOrder = compData.data;
    const liveMenu = await MenuItem.find();
    const liveMap = new Map(liveMenu.map(m => [m._id.toString(), m]));

    let reorderAdded = 0;
    let reorderUnavailable = [];

    for (const item of completedOrder.items) {
      const live = liveMap.get(item.menuItem.toString());
      if (live && live.available) {
        reorderAdded += item.quantity;
      } else {
        reorderUnavailable.push(item.name);
      }
    }

    if (reorderAdded !== 3) {
      throw new Error(`Reorder count mismatch: Expected 3, got ${reorderAdded}`);
    }
    console.log(`✓ Reorder Flow Verified: ${reorderAdded} items available with live catalog pricing`);

    // 11. Test Sold Out Menu Item Reorder Rejection
    const soldOutOrder = await Order.create({
      user: student._id,
      items: [{ menuItem: puff._id, name: puff.name, price: puff.price, quantity: 1 }],
      subtotal: puff.price,
      status: 'COMPLETED',
      pickupType: 'immediate',
      pickupTime: 'Immediate',
      token: 'CB-9999',
      paymentStatus: 'PAID'
    });

    let soldOutAdded = 0;
    let soldOutUnavailable = [];
    for (const item of soldOutOrder.items) {
      const live = liveMap.get(item.menuItem.toString());
      if (live && live.available) {
        soldOutAdded += item.quantity;
      } else {
        soldOutUnavailable.push(item.name);
      }
    }
    if (soldOutAdded !== 0 || soldOutUnavailable.length !== 1) {
      throw new Error('Sold out reorder validation failed');
    }
    console.log(`✓ Unavailable Dish Reorder Handling: Correctly detected "${soldOutUnavailable[0]}" as sold out`);

    console.log('\n=========================================');
    console.log('🎉 ALL PHASE 08 AUTOMATED SUITE PASSED! 🎉');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    if (mongod) await mongod.stop();
  }
};

runTests();
