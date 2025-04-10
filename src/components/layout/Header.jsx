import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-indigo-500 to-indigo-700 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpenIcon className="h-7 w-7 text-white transition-colors" />
            <span className="text-2xl font-bold text-white transition-colors group-hover:scale-105 transform duration-200">
              BookHaven
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/"
              className={`text-white hover:text-indigo-300 transition-all duration-200 text-base relative after:absolute after:bottom-0 after:left-0
                after:h-0.5 after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300 ${isActive('/') ? 'font-medium' : ''}`}>
              Home
            </Link>

            {isAuthenticated && (
              <>
                {user.user.role === 'seller' && (
                  <Link to="/seller/dashboard"
                    className={`text-white hover:text-indigo-300 transition-all duration-200 text-base relative after:absolute after:bottom-0 after:left-0
                      after:h-0.5 after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300 ${isActive('/seller/dashboard') ? 'font-medium' : ''}`}>
                    Dashboard
                  </Link>
                )}
                <Link to="/profile"
                  className={`text-white hover:text-indigo-300 transition-all duration-200 text-base relative after:absolute after:bottom-0 after:left-0
                    after:h-0.5 after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300 ${isActive('/profile') ? 'font-medium' : ''}`}>
                  Profile
                </Link>
              </>
            )}

            <Link to="/cart" className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white group-hover:text-indigo-300 transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-transform group-hover:scale-110">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-700 hover:bg-indigo-100 px-5 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md text-sm hover:text-indigo-800"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login"
                  className="text-white hover:text-indigo-200 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register"
                  className="bg-white text-indigo-700 hover:bg-indigo-100 px-5 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md text-sm hover:text-indigo-800">
                  Register
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-3 rounded-lg bg-white shadow-lg overflow-hidden animate-fadeIn">
            <Link to="/"
              className={`block px-4 py-3 hover:bg-indigo-50 text-gray-700 ${isActive('/') && 'text-indigo-600 bg-indigo-50 font-medium'}`}
              onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            {isAuthenticated && (
              <>
                {user?.role === 'seller' && (
                  <Link to="/seller/dashboard"
                    className={`block px-4 py-3 hover:bg-indigo-50 text-gray-700 ${isActive('/seller/dashboard') && 'text-indigo-600 bg-indigo-50 font-medium'}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Seller Dashboard
                  </Link>
                )}
                <Link to="/profile"
                  className={`block px-4 py-3 hover:bg-indigo-50 text-gray-700 ${isActive('/profile') && 'text-indigo-600 bg-indigo-50 font-medium'}`}
                  onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </>
            )}

            <Link to="/cart"
              className={`block px-4 py-3 hover:bg-indigo-50 text-gray-700 ${isActive('/cart') && 'text-indigo-600 bg-indigo-50 font-medium'}`}
              onClick={() => setMobileMenuOpen(false)}>
              Cart {totalItems > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-rose-500 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login"
                  className={`block px-4 py-3 hover:bg-indigo-50 text-gray-700 ${isActive('/login') && 'text-indigo-600 bg-indigo-50 font-medium'}`}
                  onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register"
                  className={`block px-4 py-3 hover:bg-indigo-50 text-gray-700 ${isActive('/register') && 'text-indigo-600 bg-indigo-50 font-medium'}`}
                  onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;