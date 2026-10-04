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
const PORT = 5195;
const BASE_URL = `http://localhost:${PORT}/api`;

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
};

const runPhase11Tests = async () => {
  try {
    console.log('========================================================================');
    console.log('   CAMPUSBITE PHASE 11: AUTHENTICATION, ROLES & SECURITY HARDENING');
    console.log('========================================================================\n');

    // 1. Setup in-memory MongoDB and test HTTP server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✓ In-memory MongoDB initialized:', uri);

    server = app.listen(PORT, () => {
      console.log(`✓ Test HTTP Server listening on ${BASE_URL}\n`);
    });

    // Helper to extract cookie from response headers
    const getCookie = (res) => {
      const setCookie = res.headers.get('set-cookie');
      if (!setCookie) return null;
      const match = setCookie.match(/token=[^;]+/);
      return match ? match[0] : null;
    };

    // =========================================================================
    // TEST SUITE 1: REGISTRATION & ROLE ESCALATION DEFENSE
    // =========================================================================
    console.log('--- 1. Public Registration & Role Escalation Defense ---');

    // 1.1 Register Student
    const regStudentRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sreesh M',
        email: 'sreesh@campusbite.edu',
        password: 'Password123!',
        role: 'STUDENT'
      })
    });
    const regStudentData = await regStudentRes.json();
    assert(regStudentRes.status === 201, 'Student registration returns 201 Created');
    assert(regStudentData.success === true, 'Student registration response reports success: true');
    assert(regStudentData.user.role === 'STUDENT', 'User role is correctly set to STUDENT');
    assert(regStudentData.user.passwordHash === undefined, 'passwordHash is NOT leaked in registration response');
    const studentCookie = getCookie(regStudentRes);
    assert(studentCookie && studentCookie.startsWith('token='), 'HTTP-only JWT cookie is set upon registration');

    // Verify DB password hash
    const dbStudent = await User.findOne({ email: 'sreesh@campusbite.edu' }).select('+passwordHash');
    assert(dbStudent && dbStudent.passwordHash !== 'Password123!', 'Password is stored as bcrypt hash, never plaintext');
    const isBcryptMatch = await bcrypt.compare('Password123!', dbStudent.passwordHash);
    assert(isBcryptMatch, 'Stored bcrypt hash verifies against original password');

    // 1.2 Register Faculty
    const regFacultyRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Prof. Alan Turing',
        email: 'turing@campusbite.edu',
        password: 'FacultyPassword2026',
        role: 'FACULTY'
      })
    });
    const regFacultyData = await regFacultyRes.json();
    assert(regFacultyRes.status === 201, 'Faculty registration returns 201 Created');
    assert(regFacultyData.user.role === 'FACULTY', 'Faculty role is correctly set to FACULTY');

    // 1.3 Role Escalation Defense: Attempt CANTEEN_STAFF public registration
    const regStaffAttemptRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Malicious Actor',
        email: 'attacker@campusbite.edu',
        password: 'HackerPassword999',
        role: 'CANTEEN_STAFF'
      })
    });
    const regStaffAttemptData = await regStaffAttemptRes.json();
    assert(regStaffAttemptRes.status === 403, 'Public staff registration attempt is strictly REJECTED with 403 Forbidden');
    assert(regStaffAttemptData.success === false, 'Staff registration attempt returns success: false');
    const attackerInDb = await User.findOne({ email: 'attacker@campusbite.edu' });
    assert(attackerInDb === null, 'Attacker account was not created in database');

    // 1.4 Duplicate Email Handling with Case-Insensitive Normalization
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Attempt',
        email: 'SREESH@CAMPUSBITE.EDU', // Mixed case
        password: 'AnotherPassword888',
        role: 'STUDENT'
      })
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 409, 'Duplicate email registration returns 409 Conflict');
    assert(dupData.message.includes('already exists'), 'Duplicate email returns clean user-facing error message');

    // 1.5 Validation Requirements
    const invalidRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'invalid-email',
        password: 'short'
      })
    });
    const invalidData = await invalidRes.json();
    assert(invalidRes.status === 400, 'Invalid registration payload returns 400 Bad Request');
    assert(invalidData.errors && invalidData.errors.password, 'Validation enforces minimum 8 characters password');

    // =========================================================================
    // TEST SUITE 2: LOGIN, SESSIONS & ERROR PRIVACY
    // =========================================================================
    console.log('\n--- 2. Login, Generic Error Privacy & Session Restoration ---');

    // Seed a Staff Account for testing
    const salt = await bcrypt.genSalt(10);
    const staffUser = await User.create({
      name: 'Chef Gordon',
      email: 'chef.gordon@campusbite.edu',
      passwordHash: await bcrypt.hash('KitchenStaff123', salt),
      role: 'CANTEEN_STAFF',
      isActive: true
    });

    // Seed an Inactive User
    await User.create({
      name: 'Deactivated Student',
      email: 'deactivated@campusbite.edu',
      passwordHash: await bcrypt.hash('deactivated123', salt),
      role: 'STUDENT',
      isActive: false
    });

    // 2.1 Successful Student Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sreesh@campusbite.edu',
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Student login returns 200 OK');
    assert(loginData.user.email === 'sreesh@campusbite.edu', 'Login returns authenticated student data');
    assert(loginData.user.passwordHash === undefined, 'passwordHash is NOT present in login response');
    const activeStudentCookie = getCookie(loginRes);
    assert(activeStudentCookie !== null, 'Login response sets valid auth cookie');

    // 2.2 Successful Staff Login
    const staffLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'chef.gordon@campusbite.edu',
        password: 'KitchenStaff123'
      })
    });
    const staffLoginData = await staffLoginRes.json();
    assert(staffLoginRes.status === 200, 'Staff login returns 200 OK');
    assert(staffLoginData.user.role === 'CANTEEN_STAFF', 'Staff role is verified');
    const activeStaffCookie = getCookie(staffLoginRes);

    // 2.3 Wrong Password -> Generic 401
    const wrongPassRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sreesh@campusbite.edu',
        password: 'WrongPassword999'
      })
    });
    const wrongPassData = await wrongPassRes.json();
    assert(wrongPassRes.status === 401, 'Incorrect password returns 401 Unauthorized');
    assert(wrongPassData.message === 'Invalid email or password.', 'Generic error message for wrong password');

    // 2.4 Non-existent Email -> Generic 401 (Identical to wrong password)
    const unknownEmailRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody@campusbite.edu',
        password: 'AnyPassword123'
      })
    });
    const unknownEmailData = await unknownEmailRes.json();
    assert(unknownEmailRes.status === 401, 'Non-existent email returns 401 Unauthorized');
    assert(unknownEmailData.message === 'Invalid email or password.', 'Generic error message for unknown email prevents user enumeration');

    // 2.5 Inactive Account Login Rejection
    const inactiveRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'deactivated@campusbite.edu',
        password: 'deactivated123'
      })
    });
    assert(inactiveRes.status === 401, 'Inactive account login is rejected with 401');

    // 2.6 Session Restoration via GET /api/auth/me
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: activeStudentCookie }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'GET /api/auth/me returns 200 with valid cookie');
    assert(meData.user.email === 'sreesh@campusbite.edu', 'GET /api/auth/me returns current user');
    assert(meData.user.passwordHash === undefined, 'passwordHash is NOT present in /me response');

    // 2.7 Unauthenticated /api/auth/me
    const unauthMeRes = await fetch(`${BASE_URL}/auth/me`);
    assert(unauthMeRes.status === 401, 'GET /api/auth/me without cookie returns 401 Unauthorized');

    // 2.8 Tampered / Invalid JWT Cookie
    const tamperedRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: 'token=invalid.tampered.jwt_signature' }
    });
    assert(tamperedRes.status === 401, 'Tampered JWT cookie returns 401 Unauthorized');

    // 2.9 Logout & Cookie Invalidation
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST'
    });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200, 'POST /api/auth/logout returns 200 OK');
    const logoutSetCookie = logoutRes.headers.get('set-cookie');
    assert(logoutSetCookie && logoutSetCookie.includes('1970'), 'Logout clears auth cookie by expiring it');

    // =========================================================================
    // TEST SUITE 3: PROFILE, MASS-ASSIGNMENT & PASSWORD CHANGE
    // =========================================================================
    console.log('\n--- 3. Profile Management & Mass Assignment Defense ---');

    // 3.1 Valid Name Update
    const updateNameRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({ name: 'Sreesh M (Senior)' })
    });
    const updateNameData = await updateNameRes.json();
    assert(updateNameRes.status === 200, 'PATCH /api/auth/profile updates name successfully');
    assert(updateNameData.user.name === 'Sreesh M (Senior)', 'Updated name is reflected in response');

    // 3.2 Mass-Assignment Defense: Attempt to escalate role / inject fields via Profile
    const massAssignRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({
        name: 'Sreesh M Verified',
        role: 'CANTEEN_STAFF', // Escalation payload
        email: 'hacked@malicious.com', // Invariant email change
        isActive: false,
        passwordHash: 'injected_fake_hash'
      })
    });
    const massAssignData = await massAssignRes.json();
    assert(massAssignRes.status === 200, 'Profile update returns 200 for allowed fields');
    assert(massAssignData.user.role === 'STUDENT', 'MASS-ASSIGNMENT BLOCKED: User role remains STUDENT');
    assert(massAssignData.user.email === 'sreesh@campusbite.edu', 'MASS-ASSIGNMENT BLOCKED: Email remains unchanged');

    // Verify DB integrity
    const studentDbCheck = await User.findOne({ email: 'sreesh@campusbite.edu' }).select('+passwordHash');
    assert(studentDbCheck.role === 'STUDENT', 'DB Verification: role remains STUDENT');
    assert(studentDbCheck.isActive === true, 'DB Verification: isActive remains true');
    assert(studentDbCheck.passwordHash !== 'injected_fake_hash', 'DB Verification: passwordHash not overwritten');

    // 3.3 Password Change - Reject Wrong Current Password
    const badPassChangeRes = await fetch(`${BASE_URL}/auth/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({
        currentPassword: 'WrongCurrentPassword',
        newPassword: 'BrandNewSecurePassword123'
      })
    });
    assert(badPassChangeRes.status === 400, 'Password change with wrong current password returns 400 Bad Request');

    // 3.4 Password Change - Reject Short New Password (< 8 chars)
    const shortPassChangeRes = await fetch(`${BASE_URL}/auth/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({
        currentPassword: 'Password123!',
        newPassword: 'short'
      })
    });
    assert(shortPassChangeRes.status === 400, 'Password change with < 8 chars returns 400 Bad Request');

    // 3.5 Successful Password Change
    const validPassChangeRes = await fetch(`${BASE_URL}/auth/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({
        currentPassword: 'Password123!',
        newPassword: 'BrandNewSecurePassword2026'
      })
    });
    const validPassChangeData = await validPassChangeRes.json();
    assert(validPassChangeRes.status === 200, 'Password change returns 200 OK on success');
    assert(validPassChangeData.success === true, 'Password update response reports success');

    // Verify new password works on login
    const newPassLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sreesh@campusbite.edu',
        password: 'BrandNewSecurePassword2026'
      })
    });
    assert(newPassLoginRes.status === 200, 'Login with newly changed password succeeds (200 OK)');

    // Verify old password no longer works
    const oldPassLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sreesh@campusbite.edu',
        password: 'Password123!'
      })
    });
    assert(oldPassLoginRes.status === 401, 'Login with old password fails (401 Unauthorized)');

    // =========================================================================
    // TEST SUITE 4: ROLE AUTHORIZATION ON ORDERS & MENU
    // =========================================================================
    console.log('\n--- 4. Role Authorization on Sensitive Endpoints ---');

    // Create a sample menu item
    const sampleItem = await MenuItem.create({
      name: 'Paneer Wrap',
      description: 'Spiced cottage cheese wrapped in flatbread',
      price: 90,
      category: 'SNACKS',
      foodType: 'VEG',
      available: true,
      preparationTime: 8
    });

    // 4.1 Student tries to access staff orders -> 403
    const studentStaffOrdersRes = await fetch(`${BASE_URL}/orders/staff/all`, {
      headers: { Cookie: activeStudentCookie }
    });
    assert(studentStaffOrdersRes.status === 403, 'Student accessing /api/orders/staff/all is rejected with 403 Forbidden');

    // 4.2 Student tries to create a menu item -> 403
    const studentCreateMenuRes = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({
        name: 'Unauthorized Pizza',
        price: 200,
        category: 'MEALS'
      })
    });
    assert(studentCreateMenuRes.status === 403, 'Student attempting POST /api/menu is rejected with 403 Forbidden');

    // 4.3 Staff accesses staff orders -> 200 OK
    const staffOrdersRes = await fetch(`${BASE_URL}/orders/staff/all`, {
      headers: { Cookie: activeStaffCookie }
    });
    assert(staffOrdersRes.status === 200, 'Staff accessing /api/orders/staff/all succeeds with 200 OK');

    // 4.4 Staff creates a menu item -> 201 Created
    const staffCreateMenuRes = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStaffCookie
      },
      body: JSON.stringify({
        name: 'South Indian Filter Coffee',
        description: 'Traditional hot brew with foamed milk',
        price: 25,
        category: 'BEVERAGES',
        foodType: 'VEG',
        available: true,
        preparationTime: 3
      })
    });
    assert(staffCreateMenuRes.status === 201, 'Staff creating menu item succeeds with 201 Created');

    // 4.5 Customer Order Privacy: Student B cannot view Student A's order
    // Student A places an order
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: activeStudentCookie
      },
      body: JSON.stringify({
        items: [{ menuItemId: sampleItem._id.toString(), quantity: 2 }],
        pickupType: 'immediate',
        pickupTime: '12:45 PM',
        paymentMethod: 'UPI'
      })
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201, 'Student A places order successfully (201 Created)');
    const orderId = orderData.data._id;

    // Faculty login (acting as User B)
    const facultyLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'turing@campusbite.edu',
        password: 'FacultyPassword2026'
      })
    });
    const facultyCookie = getCookie(facultyLoginRes);

    // User B attempts to view Student A's order -> 403
    const foreignOrderRes = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: { Cookie: facultyCookie }
    });
    assert(foreignOrderRes.status === 403, 'Order Privacy: User B attempting to view Student A order returns 403 Forbidden');

    // Staff CAN view the order -> 200
    const staffViewOrderRes = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: { Cookie: activeStaffCookie }
    });
    assert(staffViewOrderRes.status === 200, 'Staff is authorized to view any order detail (200 OK)');

    // =========================================================================
    // TEST SUITE 5: SECURITY HEADERS (HELMET)
    // =========================================================================
    console.log('\n--- 5. Security Headers (Helmet) & Health Verification ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'API Health Check returns 200 OK');
    assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff is enforced');
    assert(healthRes.headers.get('x-frame-options') !== null, 'X-Frame-Options clickjacking protection is enforced');

    console.log('\n========================================================================');
    console.log('   🎉 ALL PHASE 11 AUTH, ROLES & SECURITY TESTS PASSED PERFECTLY!');
    console.log('========================================================================\n');
  } catch (error) {
    console.error('\n❌ PHASE 11 TEST RUN FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
};

runPhase11Tests();
