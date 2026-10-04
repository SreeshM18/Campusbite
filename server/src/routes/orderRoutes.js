import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getStaffOrders,
  getStaffStats,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// User routes (all require authentication)
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.patch('/:id/cancel', protect, cancelOrder);

// Staff operational routes
router.get('/staff/all', protect, requireStaff, getStaffOrders);
router.get('/staff/stats', protect, requireStaff, getStaffStats);
router.patch('/:id/status', protect, requireStaff, updateOrderStatus);

// Single order detail (Owner or Staff)
router.get('/:id', protect, getOrderById);

export default router;
