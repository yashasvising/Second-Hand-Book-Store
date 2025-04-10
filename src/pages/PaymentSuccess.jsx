import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import useCart from '../hooks/useCart';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [orderInfo, setOrderInfo] = useState({
    orderId: location.state?.orderId || '',
    paymentId: location.state?.paymentId || ''
  });

  useEffect(() => {
    if (!location.state || !location.state.orderId) {
      navigate('/');
      return;
    }

    clearCart();
  }, [location.state, navigate, clearCart]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your order has been placed and will be processed shortly.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="text-sm font-medium text-gray-900">{orderInfo.orderId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Payment ID:</p>
              <p className="text-sm font-medium text-gray-900">{orderInfo.paymentId}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/profile"
            className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Order Details
          </Link>

          <Link
            to="/books"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-gray-50"
          >
            Continue Shopping
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;