import { Link } from 'react-router-dom';
import BookForm from '../../components/seller/BookForm';

const AddBook = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the details to list a new book for sale
              </p>
            </div>
            <Link
              to="/seller/books"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Books
            </Link>
          </div>
          <div className="mt-4 bg-white overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  Tip
                </span>
                Complete all required fields marked with an asterisk (*). Adding detailed information and good quality images will help your book sell faster.
              </div>
            </div>
          </div>
        </div>

        {/* Book Form */}
        <BookForm />
      </div>
    </div>
  );
};

export default AddBook;