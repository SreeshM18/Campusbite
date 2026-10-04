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

const runPhase10Tests = async () => {
  try {
    console.log('--- Starting CampusBite Phase 10 Staff Menu Management & Inventory Verification ---');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✓ Connected to in-memory test database:', uri);

    server = app.listen(5190, () => {
      console.log('✓ Test HTTP Server active on http://localhost:5190');
    });

    const salt = await bcrypt.genSalt(10);
    const studentHash = await bcrypt.hash('student123', salt);
    const staffHash = await bcrypt.hash('staff123', salt);
    const facultyHash = await bcrypt.hash('faculty123', salt);

    const student = await User.create({
      name: 'Pooja Verma (Student)',
      email: 'pooja.student@campusbite.edu',
      passwordHash: studentHash,
      role: 'STUDENT'
    });

    const staff = await User.create({
      name: 'Chef Govind (Canteen Manager)',
      email: 'govind.staff@campusbite.edu',
      passwordHash: staffHash,
      role: 'CANTEEN_STAFF'
    });

    const faculty = await User.create({
      name: 'Prof. Ramesh Gupta',
      email: 'ramesh.faculty@campusbite.edu',
      passwordHash: facultyHash,
      role: 'FACULTY'
    });

    const secret = process.env.JWT_SECRET || 'campusbite_super_secure_jwt_secret_key_2026_production';
    const studentToken = jwt.sign({ id: student._id }, secret, { expiresIn: '1d' });
    const facultyToken = jwt.sign({ id: faculty._id }, secret, { expiresIn: '1d' });
    const staffToken = jwt.sign({ id: staff._id }, secret, { expiresIn: '1d' });

    console.log('✓ Test users & JWT tokens initialized');

    // 1. SECURITY TESTS: Role Enforcement on Menu Mutations
    console.log('\n--- 1. Role-Based Security on Menu Mutations ---');
    
    // Unauthenticated POST /api/menu -> 401
    const unauthRes = await fetch('http://localhost:5190/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker Dosa', price: 10 })
    });
    if (unauthRes.status !== 401) {
      throw new Error(`Unauthenticated menu creation should return 401, got ${unauthRes.status}`);
    }
    console.log('✓ Unauthenticated request blocked from POST /api/menu (401 Unauthorized)');

    // Student POST /api/menu -> 403
    const studentPostRes = await fetch('http://localhost:5190/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ name: 'Student Custom Item', price: 50, category: 'SNACKS' })
    });
    if (studentPostRes.status !== 403) {
      throw new Error(`Student menu creation should return 403, got ${studentPostRes.status}`);
    }
    console.log('✓ Student blocked from POST /api/menu (403 Forbidden)');

    // 2. VALIDATION TESTS: Strict Server-Side Data Validation
    console.log('\n--- 2. Server-Side Data Validation ---');

    // Missing name & negative price -> 400 Bad Request
    const invalidRes = await fetch('http://localhost:5190/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        name: '',
        description: 'Short',
        price: -20,
        category: 'INVALID_CATEGORY'
      })
    });
    const invalidData = await invalidRes.json();
    if (invalidRes.status !== 400 || !invalidData.errors || !invalidData.errors.name || !invalidData.errors.price) {
      throw new Error(`Validation failed test: Expected 400 with structured errors, got ${JSON.stringify(invalidData)}`);
    }
    console.log('✓ Server-side validation rejected invalid fields with structured field errors (400 Bad Request)');

    // 3. STAFF ADDS DISH: Valid Creation
    console.log('\n--- 3. Staff Food Creation & Catalog Ingestion ---');
    const validCreateRes = await fetch('http://localhost:5190/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        name: 'Special Paneer Butter Masala Combo',
        description: 'Rich creamy cottage cheese gravy served with 2 fresh butter naans and salad.',
        price: 160,
        category: 'MEALS',
        subcategory: 'North Indian',
        foodType: 'VEG',
        image: '/images/veg_biriyani.jpg',
        preparationTime: 15,
        featured: true,
        availabilityStatus: 'AVAILABLE'
      })
    });
    const validCreateData = await validCreateRes.json();
    if (validCreateRes.status !== 201 || !validCreateData.data._id) {
      throw new Error(`Menu item creation failed: ${JSON.stringify(validCreateData)}`);
    }
    const createdDish = validCreateData.data;
    console.log(`✓ Staff created dish: "${createdDish.name}" (ID: ${createdDish._id}, Price: ₹${createdDish.price})`);

    // Create a 2nd and 3rd item for bulk tests
    const dish2 = await MenuItem.create({
      name: 'Kolkata Egg Roll',
      description: 'Layered paratha with double spiced eggs and crunchy onions.',
      price: 65,
      category: 'SNACKS',
      subcategory: 'Rolls',
      foodType: 'NON_VEG',
      image: '/images/chicken_roll.jpg',
      availabilityStatus: 'AVAILABLE',
      available: true
    });

    const dish3 = await MenuItem.create({
      name: 'Fresh Mango Lassi',
      description: 'Thick chilled sweet yogurt blended with Alphonso mango pulp.',
      price: 50,
      category: 'BEVERAGES',
      subcategory: 'Lassi',
      foodType: 'VEG',
      availabilityStatus: 'AVAILABLE',
      available: true
    });

    // 4. EDIT FOOD: Price & Metadata Update
    console.log('\n--- 4. Staff Edit Food & Price Authority ---');
    const editRes = await fetch(`http://localhost:5190/api/menu/${createdDish._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        price: 180, // Price revised from 160 to 180
        preparationTime: 18,
        description: 'Rich creamy cottage cheese gravy served with 2 hot butter naans, jeera rice, and pickled onions.'
      })
    });
    const editData = await editRes.json();
    if (editRes.status !== 200 || editData.data.price !== 180 || editData.data.preparationTime !== 18) {
      throw new Error(`Edit failed: Expected price 180, got ${editData.data?.price}`);
    }
    console.log(`✓ Dish updated successfully: New Price = ₹${editData.data.price}, Prep Time = ${editData.data.preparationTime} mins`);

    // 5. CUSTOMER SYNC: Verify Student sees updated price immediately
    console.log('\n--- 5. Customer Catalog Live Sync ---');
    const customerMenuRes = await fetch('http://localhost:5190/api/menu');
    const customerMenuData = await customerMenuRes.json();
    const syncedDish = customerMenuData.data.find(d => d._id === createdDish._id);
    if (!syncedDish || syncedDish.price !== 180) {
      throw new Error('Customer menu does not reflect updated price from MongoDB');
    }
    console.log(`✓ Customer menu synchronized: "${syncedDish.name}" displays current price ₹${syncedDish.price}`);

    // 6. AVAILABILITY TOGGLE: Fast Stock Management
    console.log('\n--- 6. Stock Availability Toggles (AVAILABLE / SOLD_OUT / UNAVAILABLE) ---');
    
    // Toggle dish 2 to SOLD_OUT
    const soldOutRes = await fetch(`http://localhost:5190/api/menu/${dish2._id}/availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ availabilityStatus: 'SOLD_OUT' })
    });
    const soldOutData = await soldOutRes.json();
    if (soldOutData.data.availabilityStatus !== 'SOLD_OUT' || soldOutData.data.available !== false) {
      throw new Error('Stock update to SOLD_OUT failed');
    }
    console.log(`✓ Marked "${dish2.name}" as SOLD_OUT (available = false)`);

    // Verify Customer sees dish2 as available: false
    const custAfterSoldOut = await (await fetch('http://localhost:5190/api/menu')).json();
    const custDish2 = custAfterSoldOut.data.find(d => d._id === dish2._id.toString());
    if (!custDish2 || custDish2.available !== false) {
      throw new Error('Customer menu does not reflect SOLD_OUT status');
    }
    console.log(`✓ Customer sees "${custDish2.name}" as Sold Out (Add button disabled)`);

    // 7. ORDER CHECKOUT GUARD: Sold Out Item Rejection
    console.log('\n--- 7. Sold-Out Item Checkout Guard ---');
    const orderSoldOutRes = await fetch('http://localhost:5190/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        items: [{ menuItemId: dish2._id, quantity: 1 }],
        pickupType: 'immediate',
        pickupTime: 'Immediate'
      })
    });
    if (orderSoldOutRes.status !== 400) {
      throw new Error(`Sold-out order guard failed: Expected 400, got ${orderSoldOutRes.status}`);
    }
    console.log('✓ Order rejection guard: Placing order for sold-out item rejected with 400 Bad Request');

    // 8. BULK AVAILABILITY UPDATE
    console.log('\n--- 8. Bulk Availability Operations ---');
    const bulkRes = await fetch('http://localhost:5190/api/menu/bulk/availability', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        itemIds: [dish2._id, dish3._id],
        availabilityStatus: 'AVAILABLE'
      })
    });
    const bulkData = await bulkRes.json();
    if (!bulkData.success || bulkData.modifiedCount !== 2) {
      throw new Error(`Bulk update failed: Expected 2 modified items, got ${bulkData.modifiedCount}`);
    }
    console.log(`✓ Bulk operation succeeded: 2 items restored to AVAILABLE state`);

    // 9. ARCHIVING & HISTORICAL ORDER SNAPSHOT PRESERVATION
    console.log('\n--- 9. Archiving & Historical Order Safety ---');
    
    // First, place an order with dish3
    const orderWithDish3 = await Order.create({
      user: student._id,
      items: [{
        menuItem: dish3._id,
        name: dish3.name,
        price: dish3.price,
        quantity: 2
      }],
      subtotal: dish3.price * 2,
      status: 'COMPLETED',
      pickupType: 'immediate',
      pickupTime: 'Immediate',
      token: 'CB-5555',
      paymentStatus: 'PAID'
    });

    // Staff archives dish3
    const archiveRes = await fetch(`http://localhost:5190/api/menu/${dish3._id}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({ isArchived: true })
    });
    const archiveData = await archiveRes.json();
    if (!archiveData.success || !archiveData.data.isArchived) {
      throw new Error('Archive operation failed');
    }
    console.log(`✓ Staff archived "${dish3.name}" (isArchived = true)`);

    // Verify Customer menu hides archived dish
    const custAfterArchive = await (await fetch('http://localhost:5190/api/menu')).json();
    const hiddenArchivedDish = custAfterArchive.data.find(d => d._id === dish3._id.toString());
    if (hiddenArchivedDish) {
      throw new Error('Customer menu still shows archived dish!');
    }
    console.log('✓ Customer menu cleanly excludes archived item from catalog');

    // Verify historical order still loads and displays historical receipt snapshot
    const fetchedOrder = await Order.findById(orderWithDish3._id);
    if (!fetchedOrder || fetchedOrder.items[0].name !== dish3.name || fetchedOrder.subtotal !== 100) {
      throw new Error('Historical order snapshot corrupted by menu archiving');
    }
    console.log(`✓ Historical Order Receipt Intact: Token ${fetchedOrder.token}, Item "${fetchedOrder.items[0].name}", Subtotal ₹${fetchedOrder.subtotal}`);

    // 10. STAFF INVENTORY STATS ENDPOINT
    console.log('\n--- 10. Staff Inventory Metrics & Category Counts ---');
    const staffMenuRes = await fetch('http://localhost:5190/api/menu/staff', {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    const staffMenuData = await staffMenuRes.json();
    if (!staffMenuData.success || !staffMenuData.stats) {
      throw new Error('Staff menu stats endpoint failed');
    }
    const { stats } = staffMenuData;
    console.log(`✓ Staff Inventory Stats: Total = ${stats.totalItems}, In Stock = ${stats.availableCount}, Sold Out = ${stats.soldOutCount}, Archived = ${stats.archivedCount}`);

    console.log('\n=========================================');
    console.log('🎉 ALL PHASE 10 STAFF MENU TESTS PASSED! 🎉');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 10 Test Failed:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    if (mongod) await mongod.stop();
  }
};

runPhase10Tests();
