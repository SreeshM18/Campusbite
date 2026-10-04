import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { MenuItem } from '../models/MenuItem.js';
import { Order } from '../models/Order.js';
import { initialMenuItems } from '../seeds/data/menuItems.js';
import bcrypt from 'bcryptjs';

let mongod = null;

const seedInitialDataIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    const menuCount = await MenuItem.countDocuments();

    let studentUser;

    if (userCount === 0) {
      console.log('[Database Setup]: Empty users detected. Creating demo accounts...');
      const salt = await bcrypt.genSalt(10);
      const staffHash = await bcrypt.hash('staff123', salt);
      const studentHash = await bcrypt.hash('student123', salt);
      const facultyHash = await bcrypt.hash('faculty123', salt);

      await User.create({
        name: 'Campus Canteen Staff',
        email: 'staff@campusbite.edu',
        passwordHash: staffHash,
        role: 'CANTEEN_STAFF'
      });

      studentUser = await User.create({
        name: 'Alex Rivera (Student)',
        email: 'student@campusbite.edu',
        passwordHash: studentHash,
        role: 'STUDENT'
      });

      await User.create({
        name: 'Dr. Sarah Jenkins (Faculty)',
        email: 'faculty@campusbite.edu',
        passwordHash: facultyHash,
        role: 'FACULTY'
      });
    } else {
      studentUser = await User.findOne({ role: 'STUDENT' });
    }

    if (menuCount < 50) {
      console.log(`[Database Setup]: Seeding comprehensive 114-item campus menu catalog (Current count: ${menuCount})...`);
      await MenuItem.deleteMany({});
      const insertedItems = await MenuItem.insertMany(initialMenuItems);
      console.log(`[Database Setup]: Successfully seeded ${insertedItems.length} menu items across 7 categories.`);

      // Create a demo active order if no orders exist
      const orderCount = await Order.countDocuments();
      if (orderCount === 0 && studentUser && insertedItems.length > 5) {
        const biryaniItem = insertedItems.find(i => i.name.includes('Biryani')) || insertedItems[0];
        const coffeeItem = insertedItems.find(i => i.name.includes('Coffee')) || insertedItems[1];

        await Order.create({
          user: studentUser._id,
          items: [
            {
              menuItem: biryaniItem._id,
              name: biryaniItem.name,
              price: biryaniItem.price,
              quantity: 1
            },
            {
              menuItem: coffeeItem._id,
              name: coffeeItem.name,
              price: coffeeItem.price,
              quantity: 2
            }
          ],
          subtotal: biryaniItem.price * 1 + coffeeItem.price * 2,
          status: 'PENDING',
          pickupType: '15mins',
          pickupTime: '15 Minutes (~' + new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
          token: 'CB-1042',
          paymentStatus: 'PAID',
          paymentMethod: 'UPI',
          specialInstructions: 'Make filter coffee extra hot please'
        });
        console.log('[Database Setup]: Demo active order created for kitchen display.');
      }
    }

    console.log('[Database Setup]: Database ready with full campus food ecosystem.');
  } catch (err) {
    console.error('[Database Auto-Seed Error]:', err.message);
  }
};

export const connectDB = async () => {
  const targetUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusbite_db';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}, Database -> ${conn.connection.name}`);
    await seedInitialDataIfEmpty();
  } catch (primaryError) {
    console.warn(`[MongoDB Notice]: Could not connect to external URI (${primaryError.message}).`);
    console.log('[MongoDB]: Initializing embedded MongoDB engine for seamless zero-config local run...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Embedded MongoDB Active]: Connected to in-memory instance at ${memUri}`);
      await seedInitialDataIfEmpty();
    } catch (memError) {
      console.error(`[Fatal MongoDB Error]: ${memError.message}`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};
