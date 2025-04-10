import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const priceSum = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    setTotalItems(itemCount);
    setTotalPrice(priceSum);
  }, [cartItems]);

  const addItem = (book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item._id === book._id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...book, quantity }];
      }
    });
  };

  const addToCart = (book) => {
    addItem(book, 1);
  };

  const removeItem = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return;

    setCartItems(prevItems => {
      return prevItems.map(item =>
        item._id === bookId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const syncCart = async () => {
    try {
      setLoading(true);
      const cartData = {
        items: cartItems.map(item => ({
          book: item._id,
          quantity: item.quantity
        }))
      };

      await axios.post('/api/cart', cartData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to sync cart with server:', error);
      setLoading(false);
      return false;
    }
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      if (response.data.success && response.data.data) {
        setCartItems(response.data.data.items);
      }
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to load cart from server:', error);
      setLoading(false);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        totalItems,
        totalPrice,
        loading,
        addItem,
        addToCart,
        // removeItem: removeFromCart, 
        // removeFromCart,
        updateQuantity,
        clearCart,
        syncCart,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};