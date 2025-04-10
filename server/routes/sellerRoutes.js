import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getSellerOrders,
  getSellerStats
} from '../controllers/orderController.js';
import {
  getSellerBooks,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import { uploadImages } from '../controllers/uploadController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('seller', 'admin'));

router.get('/stats', getSellerStats);

router.post('/upload', uploadImages);

router.get('/orders', getSellerOrders);

router.get('/books', getSellerBooks);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

export default router;