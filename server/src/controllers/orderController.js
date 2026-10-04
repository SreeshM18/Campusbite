import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';

// Helper to generate unique order token: CB-XXXX
const generateUniqueToken = async () => {
  let isUnique = false;
  let token = '';
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    token = `CB-${randomNum}`;
    const existing = await Order.findOne({ token });
    if (!existing) {
      isUnique = true;
    }
  }

  // Fallback if random 4-digit space has collision pressure
  if (!isUnique) {
    token = `CB-${Date.now().toString().slice(-4)}`;
  }

  return token;
};

// @desc    Create a new order (with strict server-side price calculation)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, pickupType, pickupTime, paymentMethod, specialInstructions } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one valid menu item.'
      });
    }

    if (!pickupTime) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a pickup timing.'
      });
    }

    // 1. Fetch item IDs and query authoritative database prices
    const itemIds = items.map((i) => i.menuItemId || i._id || i.id);
    const dbMenuItems = await MenuItem.find({ _id: { $in: itemIds } });

    if (dbMenuItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected menu items are invalid or no longer exist.'
      });
    }

    // Create a lookup map for fast price and availability checking
    const itemMap = new Map(dbMenuItems.map((item) => [item._id.toString(), item]));

    let calculatedSubtotal = 0;
    const validatedOrderItems = [];

    for (const clientItem of items) {
      const id = (clientItem.menuItemId || clientItem._id || clientItem.id).toString();
      const dbItem = itemMap.get(id);

      if (!dbItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item with ID ${id} not found.`
        });
      }

      if (!dbItem.available) {
        return res.status(400).json({
          success: false,
          message: `Sorry, "${dbItem.name}" is currently sold out and unavailable.`
        });
      }

      const qty = parseInt(clientItem.quantity, 10);
      if (isNaN(qty) || qty < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for "${dbItem.name}". Minimum quantity is 1.`
        });
      }

      const itemTotal = dbItem.price * qty;
      calculatedSubtotal += itemTotal;

      validatedOrderItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price, // STRICT: authoritative price from MongoDB
        quantity: qty
      });
    }

    const token = await generateUniqueToken();

    const order = await Order.create({
      user: req.user._id,
      items: validatedOrderItems,
      subtotal: calculatedSubtotal,
      status: 'PENDING',
      pickupType: pickupType || 'immediate',
      pickupTime: pickupTime,
      token,
      paymentStatus: 'PAID', // Demo simulated payment
      paymentMethod: paymentMethod || 'UPI',
      specialInstructions: specialInstructions ? specialInstructions.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! Token generated.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user's order history with filtering & search
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (status && status.toUpperCase() !== 'ALL') {
      if (status.toUpperCase() === 'ACTIVE') {
        query.status = { $in: ['PENDING', 'PREPARING', 'READY'] };
      } else if (status.toUpperCase() === 'PAST') {
        query.status = { $in: ['COMPLETED', 'CANCELLED'] };
      } else {
        query.status = status.toUpperCase();
      }
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { token: { $regex: term, $options: 'i' } },
        { 'items.name': { $regex: term, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, orders, allUserOrders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .populate('items.menuItem', 'name image category foodType isVeg')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.find({ user: req.user._id }, 'status')
    ]);

    let activeCount = 0;
    let pastCount = 0;
    allUserOrders.forEach((o) => {
      if (['PENDING', 'PREPARING', 'READY'].includes(o.status)) {
        activeCount++;
      } else {
        pastCount++;
      }
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      activeCount,
      pastCount,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a pending order (Owner only, strictly before kitchen starts preparation)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Ownership check
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'CANTEEN_STAFF') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only cancel your own orders.'
      });
    }

    // Cancellation rule: Only PENDING orders can be cancelled by students
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order. The kitchen has already started ${order.status.toLowerCase()} this order.`
      });
    }

    order.status = 'CANCELLED';
    order.cancelledAt = new Date();
    order.cancelReason = reason ? reason.trim() : 'Cancelled by customer';
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order successfully cancelled.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner or Staff)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('items.menuItem', 'name image category foodType');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Check authorization: User must own the order or be CANTEEN_STAFF
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'CANTEEN_STAFF';

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for canteen kitchen staff queue
// @route   GET /api/orders/staff/all
// @access  Private (Staff only)
export const getStaffOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status.toUpperCase() !== 'ALL') {
      query.status = status.toUpperCase();
    }

    let ordersQuery = Order.find(query)
      .populate('user', 'name email role')
      .populate('items.menuItem', 'name image category foodType')
      .sort({ createdAt: -1 });

    const orders = await ordersQuery;

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get canteen kitchen stats & KPIs
// @route   GET /api/orders/staff/stats
// @access  Private (Staff only)
export const getStaffStats = async (req, res, next) => {
  try {
    const allOrders = await Order.find();

    const totalOrders = allOrders.length;
    let pendingCount = 0;
    let preparingCount = 0;
    let readyCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let totalRevenue = 0;

    allOrders.forEach((ord) => {
      if (ord.status === 'PENDING') pendingCount++;
      if (ord.status === 'PREPARING') preparingCount++;
      if (ord.status === 'READY') readyCount++;
      if (ord.status === 'COMPLETED') {
        completedCount++;
        totalRevenue += ord.subtotal || 0;
      }
      if (ord.status === 'CANCELLED') cancelledCount++;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pending: pendingCount,
        preparing: preparingCount,
        ready: readyCount,
        completed: completedCount,
        cancelled: cancelledCount,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Enforce strict status transitions)
// @route   PATCH /api/orders/:id/status
// @access  Private (Staff only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const targetStatus = status ? status.toUpperCase() : null;

    const validStatuses = ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status "${status}". Allowed values: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // State transition guard
    const current = order.status;
    const allowedTransitions = {
      PENDING: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // Terminal state
      CANCELLED: []  // Terminal state
    };

    if (current !== targetStatus && !allowedTransitions[current].includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Illegal transition: Cannot change status from "${current}" directly to "${targetStatus}".`
      });
    }

    order.status = targetStatus;
    if (targetStatus === 'PREPARING' && !order.preparingAt) {
      order.preparingAt = new Date();
    } else if (targetStatus === 'READY' && !order.readyAt) {
      order.readyAt = new Date();
    } else if (targetStatus === 'COMPLETED' && !order.completedAt) {
      order.completedAt = new Date();
    } else if (targetStatus === 'CANCELLED' && !order.cancelledAt) {
      order.cancelledAt = new Date();
      if (!order.cancelReason) {
        order.cancelReason = 'Cancelled by canteen staff';
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${targetStatus}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
