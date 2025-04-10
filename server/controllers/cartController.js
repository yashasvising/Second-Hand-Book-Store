import Cart from '../models/Cart.js';
import Book from '../models/Book.js';
import asyncHandler from 'express-async-handler';


export const getUserCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: 'items.book',
      select: 'title author price images quantity isAvailable'
    });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: []
    });
    await cart.save();
  }

  cart.items = cart.items.filter(item => item.book.isAvailable);

  const cartItems = cart.items.map(item => ({
    _id: item.book._id,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    images: item.book.images,
    quantity: item.quantity,
    maxQuantity: item.book.quantity
  }));

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = await cart.calculateTotalPrice();

  res.status(200).json({
    success: true,
    data: {
      items: cartItems,
      totalItems,
      totalPrice
    }
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    res.status(400);
    throw new Error('Invalid cart data format');
  }

  for (const item of items) {
    if (!item.book || !item.quantity) {
      res.status(400);
      throw new Error('Each cart item must have a book ID and quantity');
    }

    const book = await Book.findById(item.book);
    if (!book) {
      res.status(404);
      throw new Error(`Book with ID ${item.book} not found`);
    }

    if (!book.isAvailable) {
      res.status(400);
      throw new Error(`Book ${book.title} is not available`);
    }

    if (item.quantity > book.quantity) {
      res.status(400);
      throw new Error(`Only ${book.quantity} copies of ${book.title} are available`);
    }
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: []
    });
  }

  cart.items = items;
  cart.updatedAt = Date.now();

  await cart.save();

  await cart.populate({
    path: 'items.book',
    select: 'title author price images quantity isAvailable'
  });

  const cartItems = cart.items.map(item => ({
    _id: item.book._id,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    images: item.book.images,
    quantity: item.quantity,
    maxQuantity: item.book.quantity
  }));

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = await cart.calculateTotalPrice();

  res.status(200).json({
    success: true,
    data: {
      items: cartItems,
      totalItems,
      totalPrice
    }
  });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  if (!bookId) {
    res.status(400);
    throw new Error('Book ID is required');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (!book.isAvailable) {
    res.status(400);
    throw new Error('Book is not available');
  }

  if (quantity > book.quantity) {
    res.status(400);
    throw new Error(`Only ${book.quantity} copies are available`);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: []
    });
  }

  const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);

  if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + quantity;

    if (newQuantity > book.quantity) {
      res.status(400);
      throw new Error(`Cannot add more than ${book.quantity} copies to cart`);
    }

    cart.items[itemIndex].quantity = newQuantity;
  } else {
    cart.items.push({
      book: bookId,
      quantity
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();

  await cart.populate({
    path: 'items.book',
    select: 'title author price images quantity isAvailable'
  });

  const cartItems = cart.items.map(item => ({
    _id: item.book._id,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    images: item.book.images,
    quantity: item.quantity,
    maxQuantity: item.book.quantity
  }));

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = await cart.calculateTotalPrice();

  res.status(200).json({
    success: true,
    data: {
      items: cartItems,
      totalItems,
      totalPrice
    }
  });
});


export const removeCartItem = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => item.book.toString() !== bookId);
  cart.updatedAt = Date.now();
  await cart.save();

  await cart.populate({
    path: 'items.book',
    select: 'title author price images quantity isAvailable'
  });

  const cartItems = cart.items.map(item => ({
    _id: item.book._id,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    images: item.book.images,
    quantity: item.quantity,
    maxQuantity: item.book.quantity
  }));

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = await cart.calculateTotalPrice();

  res.status(200).json({
    success: true,
    data: {
      items: cartItems,
      totalItems,
      totalPrice
    }
  });
});


export const updateCartItem = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (!book.isAvailable) {
    res.status(400);
    throw new Error('Book is not available');
  }

  if (quantity > book.quantity) {
    res.status(400);
    throw new Error(`Only ${book.quantity} copies are available`);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  cart.items[itemIndex].quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();

  await cart.populate({
    path: 'items.book',
    select: 'title author price images quantity isAvailable'
  });

  const cartItems = cart.items.map(item => ({
    _id: item.book._id,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    images: item.book.images,
    quantity: item.quantity,
    maxQuantity: item.book.quantity
  }));

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = await cart.calculateTotalPrice();

  res.status(200).json({
    success: true,
    data: {
      items: cartItems,
      totalItems,
      totalPrice
    }
  });
});


export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();

  res.status(200).json({
    success: true,
    data: {
      items: [],
      totalItems: 0,
      totalPrice: 0
    }
  });
});