// components/LoadingIndicator.tsx
import React from "react";

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
