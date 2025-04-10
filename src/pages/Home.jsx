import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Loader from '../components/common/Loader';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [categories] = useState([
    { name: 'Fiction', icon: '📚' },
    { name: 'Non-Fiction', icon: '📖' },
    { name: 'Science', icon: '🔬' },
    { name: 'History', icon: '🏛️' },
    { name: 'Biography', icon: '👤' },
    { name: 'Self-Help', icon: '🧠' },
    { name: 'Technology', icon: '💻' },
    { name: 'Business', icon: '📈' },
    { name: 'Literature', icon: '🖋️' },
    { name: 'Academic', icon: '🎓' }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('Fetching featured books...');
        const featuredResponse = await axios.get('/api/books?limit=4&sort=-price');
        console.log('Featured books response:', featuredResponse.data);
        setFeaturedBooks(featuredResponse.data.data || []);

        console.log('Fetching latest books...');
        const latestResponse = await axios.get('/api/books?limit=8&sort=-createdAt');
        console.log('Latest books response:', latestResponse.data);
        setLatestBooks(latestResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 via-indigo-700/90 to-blue-700/90"></div>

        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        <div className="absolute top-20 right-10 w-60 h-60 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-200">Favorite Book</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light">
            Buy and sell second-hand books at affordable prices. Your sustainable choice for literature.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex">
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              className="flex-grow py-4 px-6 rounded-l-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all shadow-inner border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 py-4 px-8 rounded-r-xl flex items-center shadow-lg transition-all transform hover:scale-105"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search
            </button>
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link
              to="/books"
              className="bg-white text-indigo-700 font-bold py-3.5 px-8 rounded-full hover:bg-indigo-50 transition-all shadow-lg transform hover:scale-105"
            >
              Browse All Books
            </Link>
            <Link
              to="/register?role=seller"
              className=" backdrop-blur-sm bg-white/10 border-2 border-white text-white font-bold py-3.5 px-8 rounded-full hover:bg-white/20 transition-all shadow-lg transform hover:scale-105"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Categories</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Discover books across various genres and subjects that match your interests</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/books?category=${category.name}`}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all border border-gray-100 transform hover:scale-105 hover:bg-indigo-50 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl text-black font-bold mb-2">Featured Books</h2>
              <p className="text-gray-600">Handpicked selections from our collection</p>
            </div>
            <Link
              to="/books"
              className="text-indigo-600 font-semibold hover:text-indigo-800 mt-4 md:mt-0 inline-flex items-center"
            >
              View All Books
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={book.images && book.images.length > 0 ? book.images[0] : 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full mb-3 inline-block">{book.condition}</span>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                  <p className="text-gray-600 mb-3">by {book.author}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-indigo-600 font-bold text-xl">₹{book.price.toFixed(2)}</span>
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-80"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-100 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl text-black font-bold mb-2">Latest Additions</h2>
              <p className="text-gray-600">Fresh arrivals in our bookstore collection</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestBooks.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 transform hover:translate-y-[-5px]"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={book.images && book.images.length > 0 ? book.images[0] : 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Added {new Date(book.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 truncate">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-bold">₹{book.price.toFixed(2)}</span>
                    <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">{book.condition}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Why Choose BookHaven?</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">We offer the best experience for book lovers and sellers alike</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Affordable Prices</h3>
              <p className="text-gray-600">
                Find books at a fraction of their original cost, making reading accessible for everyone. Save big on your favorite titles.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 text-green-600 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Sustainable Reading</h3>
              <p className="text-gray-600">
                Give books a second life and reduce waste, contributing to a greener planet. Reading sustainably never felt so good.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Secure Transactions</h3>
              <p className="text-gray-600">
                Safe and secure payment process with Razorpay for worry-free shopping experience. Your security is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1601046668428-94ea13437736?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500 rounded-full opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Buy or Sell Books?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join our community of book lovers today. Buy books at affordable prices or sell your used books with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/register"
              className="bg-white text-indigo-700 font-bold py-4 px-10 rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up Now
            </Link>
            <Link
              to="/books"
              className="backdrop-blur-sm bg-white/10 border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/20 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;