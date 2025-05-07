
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      <span className="ml-3 text-lg font-medium text-purple-700">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
