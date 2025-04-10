import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../common/Loader';

const SellerRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.user.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;