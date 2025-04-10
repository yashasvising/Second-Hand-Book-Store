import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserCart,
  updateCart,
  addCartItem,
  removeCartItem,
  updateCartItem,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserCart)
  .post(updateCart)
  .delete(clearCart);

router.route('/item')
  .post(addCartItem);

router.route('/item/:id')
  .put(updateCartItem)
  .delete(removeCartItem);

export default router;