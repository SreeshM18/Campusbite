import express from 'express';
import {
  getMenuItems,
  getStaffMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  archiveMenuItem,
  deleteMenuItem,
  bulkUpdateAvailability
} from '../controllers/menuController.js';
import { protect, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getMenuItems);

// Staff operational routes
router.get('/staff', protect, requireStaff, getStaffMenuItems);
router.post('/', protect, requireStaff, createMenuItem);
router.patch('/bulk/availability', protect, requireStaff, bulkUpdateAvailability);
router.patch('/:id/availability', protect, requireStaff, toggleAvailability);
router.patch('/:id/archive', protect, requireStaff, archiveMenuItem);
router.patch('/:id', protect, requireStaff, updateMenuItem);
router.delete('/:id', protect, requireStaff, deleteMenuItem);

// Single item detail (Public)
router.get('/:id', getMenuItemById);

export default router;
