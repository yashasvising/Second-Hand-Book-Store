import express from 'express';
import {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getSellerOrders
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/:id/verify-payment', protect, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

export default router;