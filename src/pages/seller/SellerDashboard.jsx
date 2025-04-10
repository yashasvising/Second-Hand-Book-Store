import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShoppingBagIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const [books, setBooks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/seller/stats');
        setStats(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);
        const response = await axios.get('/api/seller/books?limit=5&sort=-createdAt');
        setBooks(response.data.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await axios.get('/api/seller/orders?limit=5&sort=-createdAt');
        setRecentOrders(response.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setOrdersLoading(false);
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

  const handleAddBook = () => {
    navigate('/seller/books/add');
  };

  const handleEditBook = (bookId) => {
    navigate(`/seller/books/edit/${bookId}`);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/seller/books/${bookId}`);
        setBooks(books.filter(book => book._id !== bookId));
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book. Please try again.');
      }
    }
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
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="mt-1 text-purple-100">Welcome back, {user?.name}!</p>
              <div className="mt-3 flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm text-purple-100">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddBook}
                className="flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium text-sm"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add New Book
              </button>
              <Link
                to="/seller/orders"
                className="flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium text-sm"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-1" />
                View Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-3">
                <BookOpenIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Books</h2>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.totalBooks / 20) * 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-full p-3">
                <CurrencyRupeeIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.totalRevenue / 20000) * 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.totalOrders / 30) * 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-amber-100 rounded-full p-3">
                <ShoppingBagIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Pending Orders</h2>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.pendingOrders / 10) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center">
                <BookOpenIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Recent Books</h2>
              </div>
              <Link
                to="/seller/books"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
              >
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {booksLoading ? (
                <div className="flex justify-center py-6">
                  <Loader size="medium" />
                </div>
              ) : books.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpenIcon className="h-12 w-12 text-indigo-300" />
                  </div>
                  <p className="text-gray-500 mb-4">No books added yet.</p>
                  <button
                    onClick={handleAddBook}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add Your First Book
                  </button>
                </div>
              ) : (
                books.map((book) => (
                  <div key={book._id} className="px-6 py-4 hover:bg-indigo-50 transition-colors duration-150">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-20 w-14 bg-gray-100 rounded-md overflow-hidden shadow">
                        <img
                          src={book.images && book.images.length > 0 ? book.images[0] : 'https://via.placeholder.com/150x200?text=No+Image'}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate max-w-xs">{book.title}</h3>
                            <p className="text-sm text-gray-500">by {book.author}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900 bg-indigo-50 px-2 py-1 rounded-md">₹{book.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-2 flex justify-between items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${book.isAvailable
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            {book.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditBook(book._id)}
                              className="p-1.5 bg-indigo-50 rounded-md text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                              title="Edit Book"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="p-1.5 bg-red-50 rounded-md text-red-600 hover:bg-red-100 transition-colors duration-200"
                              title="Delete Book"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              </div>
              <Link
                to="/seller/orders"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
              >
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {ordersLoading ? (
                <div className="flex justify-center py-6">
                  <Loader size="medium" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBagIcon className="h-12 w-12 text-blue-300" />
                  </div>
                  <p className="text-gray-500">No orders received yet.</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/seller/orders/${order._id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          Order #{order._id.substring(0, 8)}
                        </Link>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded-md">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 truncate flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {order.user?.name || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Monthly Performance</h2>
          </div>
          <div className="h-64 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;