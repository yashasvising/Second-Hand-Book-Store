import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Loader from '../components/common/Loader';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'shipped':
        return <TruckIcon className="h-8 w-8 text-blue-500" />;
      case 'processing':
        return <ClockIcon className="h-8 w-8 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-8 w-8 text-red-500" />;
      default:
        return <ClockIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Profile
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Order not found</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Order #{order._id.substring(0, 8)}
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center">
              <span className="mr-3 text-sm text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                }`}>
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>

          <div className="relative">
            <div className="absolute left-5 top-5 h-full w-0.5 bg-gray-200"></div>

            <div className="relative flex items-start mb-8">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 flex-shrink-0 z-10">
                <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Order Placed</h3>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Your order has been received and is being processed.
                </p>
              </div>
            </div>

            <div className="relative flex items-start mb-8">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 z-10 ${['processing', 'shipped', 'delivered'].includes(order.status) ?
                  'bg-indigo-100' : 'bg-gray-100'
                }`}>
                <ClockIcon className={`h-5 w-5 ${['processing', 'shipped', 'delivered'].includes(order.status) ?
                    'text-indigo-600' : 'text-gray-400'
                  }`} />
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${['processing', 'shipped', 'delivered'].includes(order.status) ?
                    'text-gray-900' : 'text-gray-500'
                  }`}>
                  Processing
                </h3>
                {order.processedAt && (
                  <p className="text-sm text-gray-500">{formatDate(order.processedAt)}</p>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  {['processing', 'shipped', 'delivered'].includes(order.status) ?
                    'Your order is being prepared for shipping.' :
                    'This step is pending.'}
                </p>
              </div>
            </div>

            <div className="relative flex items-start mb-8">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 z-10 ${['shipped', 'delivered'].includes(order.status) ?
                  'bg-indigo-100' : 'bg-gray-100'
                }`}>
                <TruckIcon className={`h-5 w-5 ${['shipped', 'delivered'].includes(order.status) ?
                    'text-indigo-600' : 'text-gray-400'
                  }`} />
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${['shipped', 'delivered'].includes(order.status) ?
                    'text-gray-900' : 'text-gray-500'
                  }`}>
                  Shipped
                </h3>
                {order.shippedAt && (
                  <p className="text-sm text-gray-500">{formatDate(order.shippedAt)}</p>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  {['shipped', 'delivered'].includes(order.status) ?
                    'Your order has been shipped.' :
                    'This step is pending.'}
                </p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 z-10 ${order.status === 'delivered' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                <CheckCircleIcon className={`h-5 w-5 ${order.status === 'delivered' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${order.status === 'delivered' ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                  Delivered
                </h3>
                {order.deliveredAt && (
                  <p className="text-sm text-gray-500">{formatDate(order.deliveredAt)}</p>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  {order.status === 'delivered' ?
                    'Your order has been delivered successfully.' :
                    'This step is pending.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>

          <div className="overflow-hidden">
            <ul role="list" className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item._id} className="py-4 flex">
                  <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.book.images && item.book.images.length > 0
                        ? item.book.images[0]
                        : 'https://via.placeholder.com/150x200?text=No+Image'}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link to={`/books/${item.book._id}`} className="hover:text-indigo-600">
                            {item.book.title}
                          </Link>
                        </h3>
                        <p className="text-sm font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">by {item.book.author}</p>
                      <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex-1 flex items-end">
                      <p className="text-sm text-gray-600">
                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

          <div className="bg-gray-50 rounded-lg p-4">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">₹{order.totalAmount }</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">Free</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">₹{order.tax?.toFixed(2) || (order.totalAmount * 0.18).toFixed(2)}</dd>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">₹{order.totalAmount + (order.totalAmount * 0.18)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Shipping Address</h3>
              <address className="not-italic text-sm text-gray-600">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Contact Information</h3>
              <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-sm text-gray-600">{order.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Payment Method</h3>
              <p className="text-sm text-gray-600">Razorpay</p>
              {order.payment && order.payment.razorpayPaymentId && (
                <p className="text-sm text-gray-600 mt-1">
                  Payment ID: {order.payment.razorpayPaymentId}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Payment Status</h3>
              <p className={`text-sm ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.paymentInfo.status === 'completed' ? 'Paid' : 'Pending'}
              </p>
              {order.paidAt && (
                <p className="text-sm text-gray-600 mt-1">
                  Paid on {formatDate(order.paidAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;