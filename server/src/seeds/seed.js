import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { MenuItem } from '../models/MenuItem.js';
import { Order } from '../models/Order.js';

dotenv.config();

const menuItemsData = [
  {
    name: 'Veg Dum Biryani',
    description: 'Fragrant basmati rice slow-cooked with fresh garden vegetables, saffron, mint, and rich aromatic spices.',
    price: 140,
    category: 'MEALS',
    foodType: 'VEG',
    image: '/images/veg_biriyani.jpg',
    available: true,
    preparationTime: 20,
    featured: true
  },
  {
    name: 'Hyderabadi Chicken Biryani',
    description: 'Tender marinated chicken pieces layered with long-grain spiced basmati rice, caramelized onions, and boiled egg.',
    price: 190,
    category: 'MEALS',
    foodType: 'NON_VEG',
    image: '/images/chicken_biriyani.jpg',
    available: true,
    preparationTime: 25,
    featured: true
  },
  {
    name: 'Crispy Masala Dosa',
    description: 'Golden crispy fermented crepe stuffed with spiced potato masala, served with freshly ground coconut chutney and piping hot sambar.',
    price: 70,
    category: 'BREAKFAST',
    foodType: 'VEG',
    image: '/images/masala_dosa.jpg',
    available: true,
    preparationTime: 10,
    featured: true
  },
  {
    name: 'Steamed Idli Sambar Platter',
    description: 'Pillowy soft steamed rice and lentil cakes served with traditional vegetable sambar and tomato chili chutney.',
    price: 50,
    category: 'BREAKFAST',
    foodType: 'VEG',
    image: '/images/idli.jpg',
    available: true,
    preparationTime: 8,
    featured: false
  },
  {
    name: 'Hot Punjabi Samosa (2 pcs)',
    description: 'Crispy deep-fried pyramid pastries stuffed with spiced potatoes, green peas, and served with tangy tamarind chutney.',
    price: 35,
    category: 'SNACKS',
    foodType: 'VEG',
    image: '/images/samosa.jpg',
    available: true,
    preparationTime: 5,
    featured: true
  },
  {
    name: 'Flaky Golden Veg Puff',
    description: 'Oven-baked multi-layered golden pastry stuffed with a savory spiced vegetable filling.',
    price: 30,
    category: 'SNACKS',
    foodType: 'VEG',
    image: '/images/Veg_Puff.jpg',
    available: true,
    preparationTime: 5,
    featured: false
  },
  {
    name: 'Crispy Peri Peri French Fries',
    description: 'Freshly fried golden potato fries tossed in zesty peri-peri seasoning and herbs, served with garlic dip.',
    price: 80,
    category: 'SNACKS',
    foodType: 'VEG',
    image: '/images/french_fries.jpg',
    available: true,
    preparationTime: 10,
    featured: true
  },
  {
    name: 'Spicy Grilled Chicken Kathi Roll',
    description: 'Warm handmade paratha rolled with smoky tandoori chicken tikka, sliced crisp onions, and mint yogurt chutney.',
    price: 120,
    category: 'SNACKS',
    foodType: 'NON_VEG',
    image: '/images/chicken_roll.jpg',
    available: true,
    preparationTime: 15,
    featured: true
  },
  {
    name: 'Loaded Mexican Tacos (2 pcs)',
    description: 'Crispy corn taco shells filled with seasoned black beans, fresh shredded lettuce, salsa, and melted cheddar.',
    price: 110,
    category: 'SNACKS',
    foodType: 'VEG',
    image: '/images/tacos.jpg',
    available: true,
    preparationTime: 12,
    featured: false
  },
  {
    name: 'Frothy Classic Cold Coffee',
    description: 'Thick, creamy iced coffee whipped with rich espresso, cold whole milk, and chocolate syrup drizzle.',
    price: 60,
    category: 'BEVERAGES',
    foodType: 'VEG',
    image: '/images/cold_coffee.jpg',
    available: true,
    preparationTime: 5,
    featured: true
  },
  {
    name: 'Royal Kesar Rasamalai (2 pcs)',
    description: 'Soft cottage cheese dumplings soaked in rich saffron and cardamom flavored clotted milk, garnished with pistachios.',
    price: 80,
    category: 'DESSERTS',
    foodType: 'VEG',
    image: '/images/rasamalai.jpg',
    available: true,
    preparationTime: 5,
    featured: true
  },
  {
    name: 'Belgian Dark Chocolate Ice Cream Sundae',
    description: 'Double scoop of Belgian dark chocolate ice cream topped with warm fudge, toasted almonds, and a maraschino cherry.',
    price: 90,
    category: 'DESSERTS',
    foodType: 'VEG',
    image: '/images/ice_cream.jpg',
    available: true,
    preparationTime: 5,
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusbite_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB successfully.');

    // Clear existing collections
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    console.log('[Seed]: Cleared existing users, menu items, and orders.');

    // Seed Demo Users with bcrypt hashed passwords
    const salt = await bcrypt.genSalt(10);
    const staffPasswordHash = await bcrypt.hash('staff123', salt);
    const studentPasswordHash = await bcrypt.hash('student123', salt);
    const facultyPasswordHash = await bcrypt.hash('faculty123', salt);

    const staffUser = await User.create({
      name: 'Campus Canteen Staff',
      email: 'staff@campusbite.edu',
      passwordHash: staffPasswordHash,
      role: 'CANTEEN_STAFF'
    });

    const studentUser = await User.create({
      name: 'Alex Rivera (Student)',
      email: 'student@campusbite.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT'
    });

    const facultyUser = await User.create({
      name: 'Dr. Sarah Jenkins (Faculty)',
      email: 'faculty@campusbite.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY'
    });

    console.log('[Seed]: Created demo accounts:');
    console.log('  - Staff:   staff@campusbite.edu / staff123 (CANTEEN_STAFF)');
    console.log('  - Student: student@campusbite.edu / student123 (STUDENT)');
    console.log('  - Faculty: faculty@campusbite.edu / faculty123 (FACULTY)');

    // Seed Menu Items
    const insertedMenuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`[Seed]: Inserted ${insertedMenuItems.length} culinary menu items.`);

    // Seed Initial Sample Active Order for Staff Queue Preview
    const sampleOrder = await Order.create({
      user: studentUser._id,
      items: [
        {
          menuItem: insertedMenuItems[0]._id,
          name: insertedMenuItems[0].name,
          price: insertedMenuItems[0].price,
          quantity: 1
        },
        {
          menuItem: insertedMenuItems[9]._id,
          name: insertedMenuItems[9].name,
          price: insertedMenuItems[9].price,
          quantity: 2
        }
      ],
      subtotal: insertedMenuItems[0].price * 1 + insertedMenuItems[9].price * 2,
      status: 'PENDING',
      pickupType: '15mins',
      pickupTime: '15 Minutes (~' + new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
      token: 'CB-1042',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      specialInstructions: 'Please make coffee extra chilled'
    });

    console.log(`[Seed]: Created sample active order (Token: ${sampleOrder.token}) for demonstration.`);
    console.log('[Seed]: Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
