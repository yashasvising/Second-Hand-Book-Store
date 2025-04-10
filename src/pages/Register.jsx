import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ExclamationCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'buyer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  });

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (formData.role === 'seller' && !formData.phone) {
      setFormError('Phone number is required for sellers');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setFormError('');

    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateStep2()) {
      return;
    }

    try {
      setIsLoading(true);

      const { ...registerData } = formData;

      await register(registerData);
      navigate('/');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 py-6 px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            {formData.role === 'seller' ? 'Create a Seller Account' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Join our marketplace and discover amazing products
          </p>
        </div>

        <div className="p-8">
          <div className="mb-4 flex justify-center items-center">
            <Link to="/login" className="group flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              <span>Already have an account? Sign in</span>
              <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <form className="space-y-6" onSubmit={step === 1 ? handleNextStep : handleSubmit}>
            {formError && (
              <div className="rounded-md bg-red-50 p-4 border-l-4 border-red-500 animate-pulse">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{formError}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex mb-8 justify-center">
              <div className="flex items-center">
                <div className={`rounded-full h-10 w-10 flex items-center justify-center transition-all duration-300 ${step >= 1 ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className={`h-1 w-14 ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-violet-600' : 'bg-gray-200'} transition-all duration-300`}></div>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md' : 'bg-gray-200'}`}>
                  2
                </div>
              </div>
            </div>

            {step === 1 ? (
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="******"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="******"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Register as <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-white"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Next
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Additional Info */
              <div className="space-y-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number {formData.role === 'seller' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required={formData.role === 'seller'}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Address Information</h3>

                  <div className="grid grid-cols-1 gap-y-4">
                    <div>
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                        Street
                      </label>
                      <input
                        id="address.street"
                        name="address.street"
                        type="text"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                        placeholder="123 Book Street"
                        value={formData.address.street}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-x-4">
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          id="address.city"
                          name="address.city"
                          type="text"
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                          placeholder="Mumbai"
                          value={formData.address.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          id="address.state"
                          name="address.state"
                          type="text"
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                          placeholder="Maharashtra"
                          value={formData.address.state}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4">
                      <div>
                        <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          id="address.postalCode"
                          name="address.postalCode"
                          type="text"
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                          placeholder="400001"
                          value={formData.address.postalCode}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          id="address.country"
                          name="address.country"
                          type="text"
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                          value={formData.address.country}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;