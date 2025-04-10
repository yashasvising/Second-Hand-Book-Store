import express from 'express';
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getSellerBooks
} from '../controllers/bookController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBook);

router.post('/', protect, authorize('seller', 'admin'), createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);
router.get('/seller/books', protect, authorize('seller', 'admin'), getSellerBooks);

export default router;