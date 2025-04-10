import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookForm = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    condition: '',
    images: [],
    isAvailable: true,
    publicationYear: '',
    publisher: '',
    isbn: '',
    language: 'English',
    pages: '',
    quantity: 1,
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    ...initialData
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isEdit && initialData.images && initialData.images.length > 0) {
      setImagePreview(initialData.images);
    }
  }, [isEdit, initialData]);

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Technology', 'Business', 'Literature', 'Academic', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadingImage(true);

    setImageFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviewUrls]);
    setUploadingImage(false);
  };

  const removeImage = (index) => {
    const isExistingImage = imagePreview[index]?.startsWith('http');

    if (!isExistingImage) {
      const fileIndex = imagePreview.slice(0, index).filter(url => !url.startsWith('http')).length;
      setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== fileIndex));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imagePreview[index])
      }));
    }

    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) return [];

    try {
      const base64Files = await Promise.all(
        imageFiles.map(file => fileToBase64(file))
      );

      const response = await axios.post('/api/seller/upload', {
        images: base64Files
      });

      return response.data.data;
    } catch (err) {
      console.error("Failed to upload images:", err);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      let imageUrls = [];

      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToCloudinary();
      }

      const allImages = [...(isEdit ? formData.images : []), ...imageUrls];

      const bookData = {
        ...formData,
        images: allImages
      };

      if (isEdit) {
        await axios.put(`/api/seller/books/${initialData._id}`, bookData);
      } else {
        await axios.post('/api/seller/books', bookData);
      }

      setSuccess(true);

      setTimeout(() => {
        navigate('/seller/books');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error('Error submitting book:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8 pb-12">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md shadow-sm">
          <div className="flex">
            <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-r-md shadow-sm">
          <div className="flex">
            <svg className="h-6 w-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 font-medium">
              Book {isEdit ? 'updated' : 'created'} successfully!
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Book Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Author
              </label>
              <input
                type="text"
                name="author"
                id="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div className="col-span-4 space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the book"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">Brief description of the book's content.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing & Availability
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Price (₹)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="block w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                Original Price (₹)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="originalPrice"
                  id="originalPrice"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="block w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Leave empty if no discount</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="0"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <div className="flex items-center mt-4">
                <input
                  id="isAvailable"
                  name="isAvailable"
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                  Available for purchase
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Uncheck this if the book is currently out of stock or unavailable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Book Details
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                id="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g., 978-3-16-148410-0"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">
                Publication Year
              </label>
              <input
                type="number"
                name="publicationYear"
                id="publicationYear"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder={new Date().getFullYear().toString()}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
                Pages
              </label>
              <input
                type="number"
                name="pages"
                id="pages"
                min="1"
                value={formData.pages}
                onChange={handleChange}
                placeholder="e.g., 320"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                id="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Publisher name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <input
                type="text"
                name="language"
                id="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g., English, Hindi"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location Information
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="location.city"
                id="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="location.state"
                id="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="e.g., Maharashtra"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location.country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="location.country"
                id="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="e.g., India"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Images
          </h3>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Book Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors">
                        {uploadingImage ? 'Uploading...' : 'Upload images'}
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="sr-only"
                        accept="image/*"
                        disabled={uploadingImage}
                      />
                    </label>
                    <p className="pl-3 flex items-center">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {uploadingImage && (
              <div className="flex justify-center items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-gray-500">Uploading images...</span>
              </div>
            )}

            {imagePreview.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview ({imagePreview.length} {imagePreview.length === 1 ? 'image' : 'images'})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-w-1 aspect-h-1">
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 text-red-500 shadow-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-1 group-hover:translate-y-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/seller/books')}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{isEdit ? 'Updating Book...' : 'Creating Book...'}</span>
            </>
          ) : (
            <span>{isEdit ? 'Update Book' : 'Create Book'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BookForm;