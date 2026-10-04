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

const runPhase09Tests = async () => {
  try {
    console.log('--- Starting CampusBite Phase 09 Staff / Kitchen Automated Verification ---');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✓ Connected to in-memory test database:', uri);

    server = app.listen(5189, () => {
      console.log('✓ Test HTTP Server active on http://localhost:5189');
    });

    const salt = await bcrypt.genSalt(10);
    const studentHash = await bcrypt.hash('student123', salt);
    const staffHash = await bcrypt.hash('staff123', salt);
    const facultyHash = await bcrypt.hash('faculty123', salt);

    const student = await User.create({
      name: 'Rohan Sharma (Student)',
      email: 'rohan.student@campusbite.edu',
      passwordHash: studentHash,
      role: 'STUDENT'
    });

    const staff = await User.create({
      name: 'Master Chef Suresh',
      email: 'canteen.staff@campusbite.edu',
      passwordHash: staffHash,
      role: 'CANTEEN_STAFF'
    });

    const faculty = await User.create({
      name: 'Prof. Anita Desai (Faculty)',
      email: 'anita.faculty@campusbite.edu',
      passwordHash: facultyHash,
      role: 'FACULTY'
    });

    const secret = process.env.JWT_SECRET || 'campusbite_super_secure_jwt_secret_key_2026_production';
    const studentToken = jwt.sign({ id: student._id }, secret, { expiresIn: '1d' });
    const facultyToken = jwt.sign({ id: faculty._id }, secret, { expiresIn: '1d' });
    const staffToken = jwt.sign({ id: staff._id }, secret, { expiresIn: '1d' });

    console.log('✓ Test accounts initialized (Student, Faculty, Canteen Staff)');

    // 1. Seed Menu Items
    const paneerRoll = await MenuItem.create({
      name: 'Paneer Tikka Roll',
      description: 'Marinated paneer chunks grilled in tandoor and rolled in paratha.',
      image: '/images/paneer_roll.jpg',
      price: 85,
      category: 'SNACKS',
      foodType: 'VEG',
      available: true,
      preparationTime: 12
    });

    const samosa = await MenuItem.create({
      name: 'Crispy Samosa (2 pcs)',
      description: 'Golden spiced potato stuffed pastry with mint chutney.',
      image: '/images/samosa.jpg',
      price: 30,
      category: 'SNACKS',
      foodType: 'VEG',
      available: true,
      preparationTime: 5
    });

    const masalaChai = await MenuItem.create({
      name: 'Cardamom Masala Chai',
      description: 'Freshly brewed aromatic tea with ginger and green cardamom.',
      image: '/images/masala_chai.jpg',
      price: 20,
      category: 'BEVERAGES',
      foodType: 'VEG',
      available: true,
      preparationTime: 5
    });

    console.log('✓ Menu items created');

    // 2. SECURITY TEST: Student / Faculty accessing staff endpoints must be blocked with 403 Forbidden
    console.log('\n--- 1. Role-Based Route & Endpoint Security ---');
    const studentAccessAll = await fetch('http://localhost:5189/api/orders/staff/all', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    if (studentAccessAll.status !== 403) {
      throw new Error(`Security Violation: Student access to staff queue should return 403, got ${studentAccessAll.status}`);
    }
    console.log('✓ Student blocked from GET /api/orders/staff/all (403 Forbidden)');

    const facultyAccessStats = await fetch('http://localhost:5189/api/orders/staff/stats', {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    if (facultyAccessStats.status !== 403) {
      throw new Error(`Security Violation: Faculty access to staff stats should return 403, got ${facultyAccessStats.status}`);
    }
    console.log('✓ Faculty blocked from GET /api/orders/staff/stats (403 Forbidden)');

    // 3. Create Orders as Student
    console.log('\n--- 2. Order Creation & Queue Ingestion ---');
    const order1Res = await fetch('http://localhost:5189/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        items: [
          { menuItemId: paneerRoll._id, quantity: 2 },
          { menuItemId: masalaChai._id, quantity: 2 }
        ],
        pickupType: 'immediate',
        pickupTime: 'Immediate (ASAP)',
        paymentMethod: 'UPI',
        specialInstructions: 'Less spicy on the rolls please'
      })
    });
    const order1Data = await order1Res.json();
    const order1 = order1Data.data;
    console.log(`✓ Order #1 Created: Token = ${order1.token}, Subtotal = ₹${order1.subtotal}, Status = ${order1.status}`);

    const order2Res = await fetch('http://localhost:5189/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        items: [{ menuItemId: samosa._id, quantity: 3 }],
        pickupType: '15mins',
        pickupTime: 'In 15 Mins (~1:30 PM)',
        paymentMethod: 'CASH_AT_COUNTER'
      })
    });
    const order2Data = await order2Res.json();
    const order2 = order2Data.data;
    console.log(`✓ Order #2 Created: Token = ${order2.token}, Subtotal = ₹${order2.subtotal}, Status = ${order2.status}`);

    // 4. Staff Queue Retrieval & Filtering
    console.log('\n--- 3. Staff Queue Retrieval & Query Filters ---');
    const staffAllRes = await fetch('http://localhost:5189/api/orders/staff/all', {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    const staffAllData = await staffAllRes.json();
    if (!staffAllData.success || staffAllData.data.length !== 2) {
      throw new Error(`Staff queue fetch failed: Expected 2 orders, got ${staffAllData.data?.length}`);
    }
    console.log(`✓ Staff retrieved all queue orders: ${staffAllData.data.length} orders present`);

    // 5. Operational Status Transitions & Timestamp Audit
    console.log('\n--- 4. Valid Status Transitions & Timestamp Audit ---');
    
    // Transition Order 1: PENDING -> PREPARING
    const prep1Res = await fetch(`http://localhost:5189/api/orders/${order1._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'PREPARING' })
    });
    const prep1Data = await prep1Res.json();
    if (!prep1Data.success || prep1Data.data.status !== 'PREPARING' || !prep1Data.data.preparingAt) {
      throw new Error('Order 1 transition to PREPARING failed or missing preparingAt timestamp');
    }
    console.log(`✓ Order 1 [${order1.token}] -> PREPARING (preparingAt = ${prep1Data.data.preparingAt})`);

    // Transition Order 1: PREPARING -> READY
    const ready1Res = await fetch(`http://localhost:5189/api/orders/${order1._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'READY' })
    });
    const ready1Data = await ready1Res.json();
    if (!ready1Data.success || ready1Data.data.status !== 'READY' || !ready1Data.data.readyAt) {
      throw new Error('Order 1 transition to READY failed or missing readyAt timestamp');
    }
    console.log(`✓ Order 1 [${order1.token}] -> READY (readyAt = ${ready1Data.data.readyAt})`);

    // Transition Order 1: READY -> COMPLETED
    const comp1Res = await fetch(`http://localhost:5189/api/orders/${order1._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    const comp1Data = await comp1Res.json();
    if (!comp1Data.success || comp1Data.data.status !== 'COMPLETED' || !comp1Data.data.completedAt) {
      throw new Error('Order 1 transition to COMPLETED failed or missing completedAt timestamp');
    }
    console.log(`✓ Order 1 [${order1.token}] -> COMPLETED (completedAt = ${comp1Data.data.completedAt})`);

    // 6. Test Illegal / Invalid Transition Guard
    console.log('\n--- 5. Illegal Transition Guard ---');
    // Order 2 is currently PENDING. Trying to jump straight to COMPLETED must fail with 400
    const illegalJumpRes = await fetch(`http://localhost:5189/api/orders/${order2._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    if (illegalJumpRes.status !== 400) {
      throw new Error(`Illegal transition guard failed: Expected 400 for PENDING -> COMPLETED, got ${illegalJumpRes.status}`);
    }
    console.log('✓ Illegal transition (PENDING -> COMPLETED directly) successfully rejected (400 Bad Request)');

    // Order 1 is COMPLETED (terminal state). Trying to revert to PREPARING must fail with 400
    const illegalRevertRes = await fetch(`http://localhost:5189/api/orders/${order1._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ status: 'PREPARING' })
    });
    if (illegalRevertRes.status !== 400) {
      throw new Error(`Terminal state guard failed: Expected 400 for COMPLETED -> PREPARING, got ${illegalRevertRes.status}`);
    }
    console.log('✓ Reversion from terminal COMPLETED state successfully rejected (400 Bad Request)');

    // 7. Staff Cancellation / Rejection with Reason
    console.log('\n--- 6. Staff Cancellation with Operational Reason ---');
    const cancelRes = await fetch(`http://localhost:5189/api/orders/${order2._id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ reason: 'Kitchen fryer maintenance under way' })
    });
    const cancelData = await cancelRes.json();
    if (!cancelData.success || cancelData.data.status !== 'CANCELLED' || !cancelData.data.cancelledAt || !cancelData.data.cancelReason.includes('fryer')) {
      throw new Error('Staff cancellation failed or missing reason/timestamp');
    }
    console.log(`✓ Staff rejected Order 2 [${order2.token}] -> CANCELLED (Reason: "${cancelData.data.cancelReason}", cancelledAt: ${cancelData.data.cancelledAt})`);

    // 8. Staff Stats Verification
    console.log('\n--- 7. Kitchen Stats & Revenue Computation ---');
    const statsRes = await fetch('http://localhost:5189/api/orders/staff/stats', {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    const statsData = await statsRes.json();
    if (!statsData.success || !statsData.stats) {
      throw new Error('Failed to retrieve staff stats');
    }
    const { stats } = statsData;
    if (stats.totalOrders !== 2 || stats.completed !== 1 || stats.cancelled !== 1 || stats.revenue !== order1.subtotal) {
      throw new Error(`Stats mismatch: Expected total=2, completed=1, cancelled=1, revenue=${order1.subtotal}, got ${JSON.stringify(stats)}`);
    }
    console.log(`✓ Kitchen Stats Verified: Total = ${stats.totalOrders}, Completed = ${stats.completed}, Cancelled = ${stats.cancelled}, Settled Revenue = ₹${stats.revenue}`);

    // 9. Customer Side Reflection & State Sync
    console.log('\n--- 8. Customer Order Synchronization ---');
    const custViewRes = await fetch(`http://localhost:5189/api/orders/${order1._id}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const custViewData = await custViewRes.json();
    if (custViewData.data.status !== 'COMPLETED' || !custViewData.data.completedAt) {
      throw new Error('Customer view does not reflect server truth for completed order');
    }
    console.log(`✓ Customer view verified: Student sees status = ${custViewData.data.status} and completion timestamp`);

    console.log('\n=========================================');
    console.log('🎉 ALL PHASE 09 STAFF / KITCHEN SUITE PASSED! 🎉');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 09 Test Failed:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    if (mongod) await mongod.stop();
  }
};

runPhase09Tests();
