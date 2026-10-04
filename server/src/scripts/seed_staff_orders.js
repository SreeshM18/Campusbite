import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../server/.env') });

import User from '../../server/src/models/User.js';
import Order from '../../server/src/models/Order.js';
import MenuItem from '../../server/src/models/MenuItem.js';

async function seedOrders() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusbite');
  console.log('Connected to MongoDB');

  const student = await User.findOne({ email: 'student@campusbite.edu' });
  const faculty = await User.findOne({ email: 'faculty@campusbite.edu' }) || student;
  const items = await MenuItem.find({}).limit(5);

  if (!items || items.length === 0) {
    console.log('No menu items found!');
    process.exit(1);
  }

  // Clear existing active orders to have a clean test batch
  await Order.deleteMany({ status: { $in: ['PENDING', 'PREPARING', 'READY'] } });

  // 1. Create a PENDING order with ASAP
  const order1 = await Order.create({
    user: student._id,
    token: 'CB-1042',
    items: [
      { menuItem: items[0]._id, name: items[0].name, price: items[0].price, quantity: 2 },
      { menuItem: items[1]._id, name: items[1].name, price: items[1].price, quantity: 1 }
    ],
    subtotal: items[0].price * 2 + items[1].price,
    tax: 5,
    platformFee: 2,
    totalAmount: items[0].price * 2 + items[1].price + 7,
    paymentMethod: 'UPI',
    paymentStatus: 'COMPLETED',
    status: 'PENDING',
    pickupTime: 'ASAP (5-10 mins)',
    specialInstructions: 'Extra spicy chutney and separate packing please.'
  });
  console.log('Created PENDING order:', order1.token);

  // 2. Create another PENDING order for Faculty
  const order2 = await Order.create({
    user: faculty._id,
    token: 'CB-2088',
    items: [
      { menuItem: items[2]._id, name: items[2].name, price: items[2].price, quantity: 3 }
    ],
    subtotal: items[2].price * 3,
    tax: 6,
    platformFee: 2,
    totalAmount: items[2].price * 3 + 8,
    paymentMethod: 'DEMO_UPI',
    paymentStatus: 'COMPLETED',
    status: 'PENDING',
    pickupTime: 'In 30 mins (1:45 PM)'
  });
  console.log('Created PENDING order 2:', order2.token);

  // 3. Create a PREPARING order
  const order3 = await Order.create({
    user: student._id,
    token: 'CB-3150',
    items: [
      { menuItem: items[3]._id, name: items[3].name, price: items[3].price, quantity: 1 },
      { menuItem: items[4]._id, name: items[4].name, price: items[4].price, quantity: 2 }
    ],
    subtotal: items[3].price + items[4].price * 2,
    tax: 4,
    platformFee: 2,
    totalAmount: items[3].price + items[4].price * 2 + 6,
    paymentMethod: 'UPI',
    paymentStatus: 'COMPLETED',
    status: 'PREPARING',
    preparingAt: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
    pickupTime: 'ASAP'
  });
  console.log('Created PREPARING order:', order3.token);

  // 4. Create a READY order waiting at counter
  const order4 = await Order.create({
    user: faculty._id,
    token: 'CB-4299',
    items: [
      { menuItem: items[0]._id, name: items[0].name, price: items[0].price, quantity: 1 }
    ],
    subtotal: items[0].price,
    tax: 3,
    platformFee: 2,
    totalAmount: items[0].price + 5,
    paymentMethod: 'PAY_AT_CANTEEN',
    paymentStatus: 'PENDING',
    status: 'READY',
    preparingAt: new Date(Date.now() - 15 * 60 * 1000),
    readyAt: new Date(Date.now() - 2 * 60 * 1000),
    pickupTime: 'ASAP'
  });
  console.log('Created READY order:', order4.token);

  await mongoose.disconnect();
  console.log('Done seeding kitchen queue!');
}

seedOrders();
