import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShoppingCartIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
  BookOpenIcon,
  GlobeAltIcon,
  CalendarIcon,
  DocumentTextIcon,
  IdentificationIcon,
  MapPinIcon,
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Loader from '../components/common/Loader';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= book.quantity) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < book.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    addItem(book, quantity);

    if (isAuthenticated) {
      try {
        await axios.post('/api/cart/item', {
          bookId: book._id,
          quantity: quantity,
        });
      } catch (err) {
        console.error('Error syncing cart with server:', err);
      }
    }

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    alert(`Contact ${book.seller.name} for more information`);
  };

  const nextImage = () => {
    if (book?.images && book.images.length > 0) {
      setSelectedImage((prev) => (prev === book.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (book?.images && book.images.length > 0) {
      setSelectedImage((prev) => (prev === 0 ? book.images.length - 1 : prev - 1));
    }
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  const calculateDiscount = () => {
    if (book?.originalPrice && book.price < book.originalPrice) {
      const discount = ((book.originalPrice - book.price) / book.originalPrice) * 100;
      return Math.round(discount);
    }
    return null;
  };

  const discount = calculateDiscount();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <XMarkIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-8 text-gray-600">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
          <p className="mb-8 text-gray-600">The book you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const conditionColors = {
    'New': 'bg-gradient-to-r from-green-400 to-green-500 text-white',
    'Like New': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
    'Good': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    'Fair': 'bg-gradient-to-r from-orange-400 to-orange-500 text-white',
    'Poor': 'bg-gradient-to-r from-red-400 to-red-500 text-white',
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="mb-8 text-sm bg-white px-4 py-3 rounded-xl shadow-sm backdrop-blur-md bg-opacity-80">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <span className="flex items-center">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link to="/books" className="text-gray-500 hover:text-indigo-600 transition-colors">
                Books
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-indigo-700 font-medium truncate max-w-xs">{book.title}</li>
          </ol>
        </nav>

        {addedToCart && (
          <div className="fixed top-20 right-0 m-4 bg-white border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-xl z-50 animate-fade-in-out flex items-center backdrop-blur-md bg-opacity-90">
            <CheckIcon className="h-6 w-6 mr-2 text-green-500" />
            <span className="font-medium">Book added to cart!</span>
            <button onClick={() => setAddedToCart(false)} className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-50 p-8 relative">
              <div className="relative bg-white rounded-xl overflow-hidden shadow-md mb-6 h-[450px] flex items-center justify-center">
                {book.images && book.images.length > 0 ? (
                  <img
                    src={book.images[selectedImage]}
                    alt={book.title}
                    className="max-h-full max-w-full object-contain transition-opacity duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <BookOpenIcon className="h-16 w-16 mb-2" />
                    <p>No image available</p>
                  </div>
                )}

                {book.images && book.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-indigo-50 transition-colors"
                      aria-label="Previous image"
                    >
                      <ArrowLeftIcon className="h-5 w-5 text-indigo-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-indigo-50 transition-colors"
                      aria-label="Next image"
                    >
                      <ArrowRightIcon className="h-5 w-5 text-indigo-600" />
                    </button>
                  </>
                )}

                {discount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {discount}% OFF
                  </div>
                )}

                <button
                  onClick={toggleWishlist}
                  className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors ${isWishlisted
                    ? 'bg-pink-50 text-pink-500 hover:bg-pink-100'
                    : 'bg-white text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                    }`}
                  aria-label="Add to wishlist"
                >
                  <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'fill-pink-500' : ''}`} />
                </button>
              </div>

              {book.images && book.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2 justify-center">
                  {book.images.map((image, index) => (
                    <div
                      key={index}
                      className={`h-20 w-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage === index
                        ? 'ring-2 ring-indigo-500 shadow-md transform scale-105'
                        : 'opacity-60 hover:opacity-100'
                        }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${book.title} - view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 md:p-10 flex flex-col">
              <div className="mb-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{book.title}</h1>
                <h2 className="text-xl text-gray-700 mb-6 italic">by {book.author}</h2>

                <div className="flex items-center flex-wrap gap-2 mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${conditionColors[book.condition]}`}>
                    {book.condition}
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 shadow-sm">
                    {book.category}
                  </span>
                </div>

                <div className="mb-6 bg-indigo-50 p-4 rounded-xl">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      ₹{book.price.toFixed(2)}
                    </span>
                    {book.originalPrice && (
                      <span className="ml-3 text-lg text-gray-500 line-through">
                        ₹{book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {book.isAvailable ? (
                    <div className="mt-2">
                      <span className="text-green-600 font-semibold flex items-center">
                        <CheckIcon className="h-5 w-5 mr-1" /> In Stock
                        {book.quantity > 1 && ` (${book.quantity} available)`}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="text-red-600 font-semibold flex items-center">
                        <XMarkIcon className="h-5 w-5 mr-1" /> Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="prose prose-indigo max-w-none mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Book Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    {book.publisher && (
                      <div className="flex items-start">
                        <span className="text-gray-600 mr-2">Publisher:</span>{' '}
                        <span className="text-gray-900 font-medium">{book.publisher}</span>
                      </div>
                    )}
                    {book.publicationYear && (
                      <div className="flex items-start">
                        <CalendarIcon className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{book.publicationYear}</span>
                      </div>
                    )}
                    {book.language && (
                      <div className="flex items-start">
                        <GlobeAltIcon className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{book.language}</span>
                      </div>
                    )}
                    {book.pages && (
                      <div className="flex items-start">
                        <DocumentTextIcon className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{book.pages} pages</span>
                      </div>
                    )}
                    {book.isbn && (
                      <div className="flex items-start col-span-full">
                        <IdentificationIcon className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{book.isbn}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <UserIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-gray-600">Seller:</span>{' '}
                      <span className="ml-1 text-gray-900 font-medium">{book.seller.name}</span>
                    </div>
                  </div>

                  {book.location && (
                    <div className="text-gray-600 mt-2 flex items-center">
                      <MapPinIcon className="h-5 w-5 text-indigo-400 mr-2" />
                      {[book.location.city, book.location.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {book.isAvailable ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <div className="flex border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={decrementQuantity}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          min="1"
                          max={book.quantity}
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-16 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                        />
                        <button
                          type="button"
                          onClick={incrementQuantity}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center py-3 px-6 rounded-xl shadow-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:-translate-y-1"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleContactSeller}
                    className="w-full flex items-center justify-center py-3 px-6 border border-indigo-600 rounded-xl shadow-sm text-indigo-600 font-medium bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Contact Seller
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <XMarkIcon className="h-8 w-8 mx-auto text-red-500 mb-2" />
                    <p className="text-red-600 font-medium">This book is currently out of stock</p>
                  </div>
                  <button
                    onClick={handleContactSeller}
                    className="w-full flex items-center justify-center py-3 px-6 border border-indigo-600 rounded-xl shadow-sm text-indigo-600 font-medium bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Contact Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;