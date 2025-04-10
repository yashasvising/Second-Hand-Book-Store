import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  UserIcon,
  ShoppingBagIcon,
  CogIcon,
  KeyIcon,
  MapPinIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const Profile = () => {
  const { user: myUser, updateProfile, changePassword, clearError } = useAuth();
  const { user } = myUser;
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });

      if (user.address) {
        setAddressData({
          street: user.address.street || '',
          city: user.address.city || '',
          state: user.address.state || '',
          postalCode: user.address.postalCode || '',
          country: user.address.country || 'India'
        });
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        try {
          setOrdersLoading(true);
          const response = await axios.get('/api/orders');
          setOrders(response.data.data);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setOrdersError(err.response?.data?.message || 'Failed to load your orders');
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    try {
      setLoading(true);
      await updateProfile(profileData);
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressSuccess('');
    setAddressError('');

    try {
      setLoading(true);
      await updateProfile({ address: addressData });
      setAddressSuccess('Address updated successfully');
    } catch (err) {
      setAddressError(err.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess('Password changed successfully');

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => {
    return (
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-x-auto">
        <nav className="flex px-4">
          <button
            onClick={() => {
              setActiveTab('profile');
              clearError();
            }}
            className={`${activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-5 px-4 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Profile Information
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              clearError();
            }}
            className={`${activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-5 px-4 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Order History
          </button>

          <button
            onClick={() => {
              setActiveTab('address');
              clearError();
            }}
            className={`${activeTab === 'address'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-5 px-4 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
          >
            <MapPinIcon className="h-5 w-5 mr-2" />
            Address
          </button>

          <button
            onClick={() => {
              setActiveTab('security');
              clearError();
            }}
            className={`${activeTab === 'security'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-5 px-4 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
          >
            <KeyIcon className="h-5 w-5 mr-2" />
            Security
          </button>
        </nav>
      </div>
    );
  };

  const renderProfileTab = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <UserIcon className="h-6 w-6 text-indigo-600 mr-2" />
          Profile Information
        </h2>

        {profileSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 mb-6">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">{profileSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {profileError && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{profileError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors duration-200"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors duration-200"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors duration-200"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderOrdersTab = () => {
    if (ordersLoading) {
      return (
        <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      );
    }

    if (ordersError) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{ordersError}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setOrdersError(null);
                setOrdersLoading(true);
                axios.get('/api/orders')
                  .then(response => {
                    setOrders(response.data.data);
                    setOrdersLoading(false);
                  })
                  .catch(err => {
                    console.error('Error fetching orders:', err);
                    setOrdersError(err.response?.data?.message || 'Failed to load your orders');
                    setOrdersLoading(false);
                  });
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Books
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="sr-only">Order History</h2>
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Your Orders</h3>
        </div>

        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order._id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Order #{order._id.substring(0, 8)}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end">
                  <p className="text-lg font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                  <span className={`inline-flex mt-1 px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item._id} className="py-6 flex">
                        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={item.book.images && item.book.images.length > 0 ? item.book.images[0] : 'https://via.placeholder.com/64x64?text=No+Image'}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.book.title}</h4>
                              <p className="ml-4 text-sm font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">by {item.book.author}</p>
                          </div>
                          <div className="mt-1 flex-1 flex items-end justify-between">
                            <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                            <Link
                              to={`/books/${item.book._id}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                              View Book
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderAddressTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Address Information</h2>

        {addressSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{addressSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {addressError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{addressError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAddressSubmit}>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                id="street"
                value={addressData.street}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={addressData.city}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={addressData.state}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                value={addressData.postalCode}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={addressData.country}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderSecurityTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>

        {passwordSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{passwordSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {passwordError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl mb-8 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Account</h1>
              <p className="text-indigo-100 mt-2">Manage your account settings and preferences</p>
            </div>
            {user && (
              <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white text-sm font-medium">Welcome back,</p>
                <p className="text-white text-lg font-bold">{user.name || 'User'}</p>
              </div>
            )}
          </div>
        </div>

        {renderTabs()}

        <div className="animate-fadeIn transition-all duration-300">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'address' && renderAddressTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};

export default Profile;