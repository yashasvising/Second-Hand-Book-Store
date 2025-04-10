import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import Loader from '../components/common/Loader';
import { FiUser, FiPhone, FiHome, FiMap, FiMapPin, FiMail, FiGlobe, FiShoppingBag, FiCreditCard, FiAlertCircle } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else if (cart.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street ||
      !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const items = cart.map(item => ({
        bookId: item._id,
        quantity: item.quantity
      }));

      const response = await axios.post('/api/orders', {
        items,
        shippingAddress
      });

      const { orderId, razorpayOrderId, amount, key } = response.data.data;

      const options = {
        key,
        amount: amount * 100,
        currency: "INR",
        name: "BookHaven",
        description: "Payment for your book purchase",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await axios.post(`/api/orders/${orderId}/verify-payment`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            clearCart();

            navigate('/payment-success', {
              state: {
                orderId,
                paymentId: response.razorpay_payment_id
              }
            });
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: user.email,
          contact: shippingAddress.phone
        },
        notes: {
          address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2 checkout-animation">Checkout</h1>
        <p className="text-gray-600 text-center mb-8 checkout-animation" style={{ animationDelay: "0.1s" }}>Complete your order and get your books delivered</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-3xl mx-auto checkout-animation" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-7 checkout-animation" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover-card">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center">
                <FiHome className="mr-2 text-indigo-600" /> Shipping Information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiUser className="mr-1 text-gray-500" /> Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiPhone className="mr-1 text-gray-500" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="street" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMap className="mr-1 text-gray-500" /> Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="123 Main Street, Apartment 4B"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMapPin className="mr-1 text-gray-500" /> City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMapPin className="mr-1 text-gray-500" /> State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMail className="mr-1 text-gray-500" /> Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="400001"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiGlobe className="mr-1 text-gray-500" /> Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="India"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 checkout-animation" style={{ animationDelay: "0.3s" }}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover-card sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center">
                <FiShoppingBag className="mr-2 text-indigo-600" /> Order Summary
              </h2>

              <div className="max-h-80 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                <ul className="divide-y divide-gray-100">
                  {cart.map((item, index) => (
                    <li key={item.bookId} className="py-4 flex group hover:bg-gray-50 p-2 rounded-lg transition-colors checkout-animation" style={{ animationDelay: `${0.35 + (index * 0.05)}s` }}>
                      <div className="flex-shrink-0 w-20 h-24 rounded-md overflow-hidden border border-gray-200 group-hover:border-indigo-200 transition-colors">
                        <img
                          src={item.image || 'https://via.placeholder.com/80x120?text=Book'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          by {item.author}
                        </p>
                        <div className="flex justify-between mt-2">
                          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 py-4 space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">₹{totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-green-600">Free</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">GST (18%)</p>
                  <p className="text-sm font-medium text-gray-900">₹{(totalPrice * 0.18).toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-base font-medium text-gray-900">Total Amount</p>
                  <p className="text-xl font-bold text-indigo-600">₹{(totalPrice * 1.18).toFixed(2)}</p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-lg py-4 px-6 font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all pulse-on-hover"
                >
                  <FiCreditCard className="mr-2" />
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>

                <div className="mt-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <p className="text-xs text-gray-700 text-center">
                    By placing an order, you agree to our <span className="text-indigo-600 font-medium">Terms of Service</span> and <span className="text-indigo-600 font-medium">Privacy Policy</span>.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center space-x-4">
                  <span className="text-gray-400">Secure Payment</span>
                  <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-6 w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;