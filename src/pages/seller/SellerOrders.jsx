import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/orders/seller');
        setOrders(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);
      await axios.put(`/api/orders/${orderId}/status`, { status });

      setOrders(orders.map(order =>
        order._id === orderId
          ? { ...order, orderStatus: status }
          : order
      ));

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update order status';
      alert(errorMsg);
      console.error('Error updating order status:', err);
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.orderStatus !== filter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = order._id.toLowerCase().includes(query);
      const matchesBuyer = order.buyer?.name?.toLowerCase().includes(query);

      const matchesItems = order.items.some(item =>
        item.book?.title?.toLowerCase().includes(query) ||
        item.book?.author?.toLowerCase().includes(query)
      );

      return matchesId || matchesBuyer || matchesItems;
    }

    return true;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const resetFilters = () => {
    setFilter('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Manage Orders</h1>
              <p className="mt-1 text-blue-100">
                View and manage all your orders
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium"
              >
                <FunnelIcon className="h-5 w-5 mr-1" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium"
              >
                <ArrowPathIcon className="h-5 w-5 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID, customer name, or book title..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Search
            </button>
          </form>

          {showFilters && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setFilter('processing')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'processing'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => setFilter('shipped')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'shipped'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                >
                  Shipped
                </button>
                <button
                  onClick={() => setFilter('delivered')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'delivered'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                >
                  Delivered
                </button>
                <button
                  onClick={() => setFilter('cancelled')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'cancelled'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                >
                  Cancelled
                </button>
              </div>
              {(filter !== 'all' || searchQuery) && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Clear all
                    <XMarkIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredOrders.length}{' '}
              {filteredOrders.length === 1 ? 'Order' : 'Orders'}
              {filter !== 'all' ? ` - ${filter.charAt(0).toUpperCase() + filter.slice(1)}` : ''}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBagIcon className="h-12 w-12 text-blue-300" />
                </div>
                <p className="text-gray-500 mb-4">No orders found</p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        {getStatusIcon(order.orderStatus)}
                        <Link
                          to={`/seller/orders/${order._id}`}
                          className="ml-2 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          Order #{order._id.substring(0, 8)}
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Customer: {order.buyer?.name || 'Anonymous'}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end">
                      <p className="text-lg font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <span className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Items from your inventory:
                    </p>
                    <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                      {order.items.map(item => (
                        <li key={item._id} className="p-4 flex">
                          <div className="flex-shrink-0 w-12 h-16 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.book?.images?.[0] || 'https://via.placeholder.com/150x200?text=No+Image'}
                              alt={item.book?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-gray-900">{item.book?.title}</h3>
                              <p className="text-sm font-medium text-gray-900">
                                ₹{item.price?.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">by {item.book?.author}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/seller/orders/${order._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Link>

                    {order.paymentInfo.status === 'completed' && (
                      <div className="flex items-center">
                        {updating === order._id ? (
                          <div className="flex items-center mr-2">
                            <Loader size="small" />
                            <span className="ml-2 text-sm text-gray-600">Updating...</span>
                          </div>
                        ) : (
                          <select
                            disabled={updating === order._id}
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="form-select px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;