import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpenIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';

const SellerBooks = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [filterAvailable, setFilterAvailable] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Technology', 'Business', 'Literature', 'Academic', 'Other'];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        let queryParams = `?page=${page}&limit=${limit}`;

        if (sort) {
          queryParams += `&sort=${sort}`;
        }

        if (search) {
          queryParams += `&search=${search}`;
        }

        if (filterAvailable) {
          queryParams += `&isAvailable=${filterAvailable === 'available'}`;
        }

        if (filterCategory) {
          queryParams += `&category=${filterCategory}`;
        }

        const response = await axios.get(`/api/seller/books${queryParams}`);

        setBooks(response.data.data);
        setTotal(response.data.count);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.response?.data?.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, limit, sort, search, filterAvailable, filterCategory]);

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/seller/books/${bookId}`);

        setBooks(books.filter(book => book._id !== bookId));
        setTotal(prev => prev - 1);
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSort('-createdAt');
    setFilterAvailable('');
    setFilterCategory('');
    setPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);
  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Your Books</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your book listings
              </p>
            </div>
            <button
              onClick={() => navigate('/seller/books/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Book
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-gray-500" />
                Filters & Search
              </h2>
              <button
                onClick={resetFilters}
                className="mt-2 md:mt-0 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-x-4">
              <div className="md:col-span-2">
                <form onSubmit={handleSearchSubmit}>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Books
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by title, author or description"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div>
                <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="filterCategory"
                  name="filterCategory"
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setPage(1);
                  }}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filterAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  id="filterAvailable"
                  name="filterAvailable"
                  value={filterAvailable}
                  onChange={(e) => {
                    setFilterAvailable(e.target.value);
                    setPage(1);
                  }}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All</option>
                  <option value="available">In Stock</option>
                  <option value="unavailable">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between flex-wrap">
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                  Sort By:
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 text-sm"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="title">Title: A-Z</option>
                  <option value="-title">Title: Z-A</option>
                </select>
              </div>

              <div className="mt-3 sm:mt-0">
                <label htmlFor="limit" className="text-sm font-medium text-gray-700 mr-2">
                  Show:
                </label>
                <select
                  id="limit"
                  name="limit"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 text-sm"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BookOpenIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Book Listings
            </h3>
            <span className="text-sm text-gray-500">
              {total} {total === 1 ? 'book' : 'books'} total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="large" />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 inline-block text-left">
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpenIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
              {(search || filterCategory || filterAvailable) ? (
                <p className="text-gray-500 mb-4">
                  Try changing your search or filter criteria
                </p>
              ) : (
                <p className="text-gray-500 mb-4">
                  You haven't added any books yet
                </p>
              )}
              <button
                onClick={() => navigate('/seller/books/add')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Book
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Book
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-12 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={book.images && book.images.length > 0 ? book.images[0] : 'https://via.placeholder.com/150x200?text=No+Image'}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                by {book.author}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            <div>{book.category}</div>
                            <div>Condition: {book.condition}</div>
                            <div>Qty: {book.quantity}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${book.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {book.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(book.price)}
                          </div>
                          {book.originalPrice && book.originalPrice > book.price && (
                            <div className="text-xs line-through text-gray-500">
                              {formatCurrency(book.originalPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/seller/books/edit/${book._id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilSquareIcon className="h-5 w-5 inline" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id, book.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                    disabled={page === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{showingFrom}</span> to{' '}
                      <span className="font-medium">{showingTo}</span> of{' '}
                      <span className="font-medium">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => setPage(page > 1 ? page - 1 : 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => (
                          p === 1 ||
                          p === totalPages ||
                          (p >= page - 1 && p <= page + 1)
                        ))
                        .map((p, i, arr) => {
                          const shouldAddEllipsisBefore = i > 0 && arr[i - 1] !== p - 1;
                          const shouldAddEllipsisAfter = i < arr.length - 1 && arr[i + 1] !== p + 1;

                          return (
                            <>
                              {shouldAddEllipsisBefore && (
                                <span
                                  key={`ellipsis-before-${p}`}
                                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                >
                                  ...
                                </span>
                              )}

                              <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${p === page
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                              >
                                {p}
                              </button>

                              {shouldAddEllipsisAfter && (
                                <span
                                  key={`ellipsis-after-${p}`}
                                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                >
                                  ...
                                </span>
                              )}
                            </>
                          );
                        })}

                      <button
                        onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerBooks;