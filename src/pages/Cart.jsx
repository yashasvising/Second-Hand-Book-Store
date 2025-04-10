import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';

const Cart = () => {
  const { cart, totalItems, totalPrice, updateQuantity, removeItem, syncCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user && cart.length > 0) {
      syncCart();
    }
  }, [isAuthenticated, user, cart.length, syncCart]);

  const handleQuantityChange = (bookId, newQuantity) => {
    updateQuantity(bookId, parseInt(newQuantity));
  };

  const handleRemoveItem = (bookId) => {
    removeItem(bookId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center">
          <Link to="/books" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center mr-10">Shopping Cart</h1>
        </div>

        {cart?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="bg-indigo-50 inline-flex p-5 rounded-full mb-6">
              <ShoppingBagIcon className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any books to your cart yet. Find your next favorite read today!</p>
            <Link
              to="/books"
              className="inline-block bg-indigo-600 text-white rounded-md py-3 px-8 font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Discover Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Your Items ({totalItems})</h2>
                    <p className="text-sm text-gray-500">Price</p>
                  </div>
                </div>
                <ul className="divide-y divide-gray-100">
                  {cart?.map((item) => (
                    <li key={item._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 rounded-lg overflow-hidden w-full sm:w-28 h-40 mb-4 sm:mb-0 border border-gray-200">
                          <img
                            src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150x200?text=No+Image'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 sm:ml-6 flex flex-col h-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                <Link to={`/books/${item._id}`} className="hover:text-indigo-600 transition-colors">
                                  {item.title}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">by {item.author}</p>
                              <div className="mt-1 inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                In Stock
                              </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mt-2 sm:mt-0">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-auto flex flex-wrap justify-between items-center">
                            <div className="flex items-center space-x-1 border border-gray-300 rounded-md overflow-hidden">
                              <button
                                type="button"
                                onClick={() => item.quantity > 1 && handleQuantityChange(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                className="w-10 text-center border-none focus:ring-0 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => item.quantity < 10 && handleQuantityChange(item._id, item.quantity + 1)}
                                disabled={item.quantity >= 10}
                                className="p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium transition-colors mt-2 sm:mt-0"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal ({totalItems} items)</p>
                    <p className="font-medium text-gray-900">₹{totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium text-green-600">Free</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Taxes</p>
                    <p className="font-medium text-gray-500">Calculated at checkout</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold text-gray-900">Total</p>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Including taxes</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={cart?.length === 0}
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>We accept:</span>
                    <div className="flex space-x-1">
                      <div className="w-8 h-5 bg-blue-900 rounded"></div>
                      <div className="w-8 h-5 bg-green-600 rounded"></div>
                      <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                      <div className="w-8 h-5 bg-red-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;