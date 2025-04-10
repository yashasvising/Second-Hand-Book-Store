import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/routing/ProtectedRoute';
import SellerRoute from './components/routing/SellerRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import NotFound from './pages/NotFound';
import Books from './pages/Books';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerBooks from './pages/seller/SellerBooks';
import AddBook from './pages/seller/AddBook';
import EditBook from './pages/seller/EditBook';
import SellerOrders from './pages/seller/SellerOrders';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/books" element={<Books />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                <Route element={<SellerRoute />}>
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/orders/:id" element={<OrderDetails />} />
                  <Route path="/seller/books" element={<SellerBooks />} />
                  <Route path="/seller/books/add" element={<AddBook />} />
                  <Route path="/seller/books/edit/:id" element={<EditBook />} />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
