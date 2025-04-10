import React from 'react';

const Loader = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    accent: 'text-green-600',
    white: 'text-white',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  const spinner = (
    <div className={`inline-block ${spinnerSize} animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${spinnerColor} align-middle`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;