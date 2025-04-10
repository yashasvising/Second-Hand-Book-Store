import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import config from '../config/index.js';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one item to your order'
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book not found with ID: ${item.bookId}`
        });
      }

      if (!book.isAvailable || book.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Book "${book.title}" is not available in the requested quantity`
        });
      }

      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price,
        seller: book.seller
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentInfo: {
        razorpayOrderId: razorpayOrder.id,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        key: config.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
      order.paymentInfo.razorpaySignature = razorpaySignature;
      order.paymentInfo.status = 'completed';
      order.orderStatus = 'processing';

      await order.save();

      for (const item of order.items) {
        const book = await Book.findById(item.book);
        book.quantity -= item.quantity;

        if (book.quantity <= 0) {
          book.isAvailable = false;
        }

        await book.save();
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: order
      });
    } else {
      order.paymentInfo.status = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate({
        path: 'items.book',
        select: 'title author images price'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.book',
        select: 'title author images price'
      })
      .populate({
        path: 'items.seller',
        select: 'name email'
      })
      .populate({
        path: 'buyer',
        select: 'name email'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      !order.items.some(item => item.seller._id.toString() === req.user._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const isSeller = order.items.some(
      item => item.seller.toString() === req.user._id.toString()
    );

    if (!isSeller && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    if (order.paymentInfo.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status for unpaid order'
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      'items.seller': req.user._id
    })
      .populate({
        path: 'items.book',
        select: 'title author images price'
      })
      .populate({
        path: 'buyer',
        select: 'name email'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerStats = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments({ seller: req.user._id });

    const orders = await Order.find({
      'items.seller': req.user._id,
      'paymentInfo.status': 'completed'
    });

    const totalOrders = orders.length;

    const pendingOrders = await Order.countDocuments({
      'items.seller': req.user._id,
      'paymentInfo.status': 'completed',
      orderStatus: { $nin: ['delivered', 'cancelled'] }
    });

    let totalRevenue = 0;
    for (const order of orders) {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user._id.toString()
      );

      for (const item of sellerItems) {
        totalRevenue += item.price * item.quantity;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalOrders,
        totalRevenue,
        pendingOrders
      }
    });
  } catch (error) {
    next(error);
  }
};