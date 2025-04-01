import Link from 'next/link';
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <ExclamationCircleIcon className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-brand-dark-blue mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-brand-teal hover:bg-brand-dark-blue text-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out shadow-md"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
