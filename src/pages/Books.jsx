import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import Loader from '../components/common/Loader';

const Books = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography',
    'Self-Help', 'Technology', 'Business', 'Literature', 'Academic'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'title:asc', label: 'Title: A to Z' },
    { value: 'title:desc', label: 'Title: Z to A' }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 12);

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (filters.category) {
          params.append('category', filters.category);
        }

        if (filters.condition) {
          params.append('condition', filters.condition);
        }

        if (filters.minPrice) {
          params.append('minPrice', filters.minPrice);
        }

        if (filters.maxPrice) {
          params.append('maxPrice', filters.maxPrice);
        }

        const [sortField, sortDirection] = (filters.sortBy + ':' + filters.sortOrder).split(':');
        params.append('sort', `${sortDirection === 'desc' ? '-' : ''}${sortField}`);

        const response = await axios.get(`/api/books?${params.toString()}`);
        setBooks(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalBooks(response.data.totalItems);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.response?.data?.message || 'Failed to fetch books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, searchQuery, filters]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append('search', searchQuery);
    }

    if (filters.category) {
      params.append('category', filters.category);
    }

    if (filters.condition) {
      params.append('condition', filters.condition);
    }

    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice);
    }

    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice);
    }

    params.append('sortBy', filters.sortBy);
    params.append('sortOrder', filters.sortOrder);

    if (page > 1) {
      params.append('page', page);
    }

    navigate(`/books?${params.toString()}`, { replace: true });
  }, [page, searchQuery, filters, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    pages.push(
      <button
        key="first"
        onClick={() => goToPage(1)}
        className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
      >
        1
      </button>
    );

    let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3) + 1);
    }

    if (startPage > 2) {
      pages.push(
        <span key="ellipsis-start" className="px-3 py-2">
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-4 py-2 rounded-md ${page === i ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis-end" className="px-3 py-2">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className={`px-4 py-2 rounded-md ${page === totalPages ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 text-center">Browse Books</h1>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex w-full md:w-2/3">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                className="flex-grow border border-gray-300 rounded-l-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-r-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto border border-gray-300 rounded-full px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm text-gray-700"
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={handleSortChange}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4 shadow-lg animate-fadeIn transform transition-all duration-300">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transform hover:scale-105 transition-transform duration-200"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    value={filters.condition}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price (₹)
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          )}

          {(filters.category || filters.condition || filters.minPrice || filters.maxPrice) && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-sm text-gray-700 font-medium">Active filters:</span>

              {filters.category && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 border border-purple-200 shadow-sm">
                  {filters.category}
                  <XMarkIcon
                    className="h-4 w-4 ml-2 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                  />
                </span>
              )}

              {filters.condition && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 border border-purple-200 shadow-sm">
                  {filters.condition}
                  <XMarkIcon
                    className="h-4 w-4 ml-2 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => setFilters(prev => ({ ...prev, condition: '' }))}
                  />
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 border border-purple-200 shadow-sm">
                  Price: {filters.minPrice ? `₹${filters.minPrice}` : '₹0'} - {filters.maxPrice ? `₹${filters.maxPrice}` : 'Any'}
                  <XMarkIcon
                    className="h-4 w-4 ml-2 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                  />
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <p className="text-gray-600 font-medium text-center">
            {loading ? (
              'Loading books...'
            ) : (
              totalBooks === 0 ? (
                'No books found matching your criteria'
              ) : (
                `Showing ${(page - 1) * 12 + 1}-${Math.min(page * 12, totalBooks)} of ${totalBooks} books`
              )
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="large" />
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto border border-gray-100">
            <BookOpenIcon className="h-20 w-20 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No books found</h2>
            <p className="text-gray-600 mb-8 text-lg">
              We couldn't find any books matching your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-full text-base font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-64 overflow-hidden bg-gray-200 relative">
                  <img
                    src={book.images && book.images.length > 0 ? book.images[0] : 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors duration-200">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-3 italic">by {book.author}</p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                      ₹{book.price.toFixed(2)}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${book.condition === 'New' ? 'bg-green-100 text-green-800 border border-green-200' :
                        book.condition === 'Like New' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          book.condition === 'Good' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            book.condition === 'Fair' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                      {book.condition}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                      {book.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {book.location?.city || ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="inline-flex rounded-full shadow-md bg-white p-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-5 py-2 rounded-l-full bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Previous
              </button>

              <div className="flex border-l border-r border-gray-200">
                {renderPagination()}
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-r-full bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;