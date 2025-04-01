import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {/* Simple Crown SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8 mr-2 text-brand-teal" // Use theme color
      >
        <path
          fillRule="evenodd"
          d="M13 3.25a.75.75 0 01.75.75v.044l.81-.81a.75.75 0 011.06 1.06l-.81.81h.044a.75.75 0 01.75.75v.044l.81-.81a.75.75 0 011.06 1.06l-.81.81h.044a.75.75 0 010 1.5h-.044l.81.81a.75.75 0 01-1.06 1.06l-.81-.81v.044a.75.75 0 01-1.5 0v-.044l-.81.81a.75.75 0 01-1.06-1.06l.81-.81h-.044a.75.75 0 01-.75-.75v-.044l-.81.81a.75.75 0 01-1.06-1.06l.81-.81h-.044a.75.75 0 010-1.5h.044l-.81-.81a.75.75 0 011.06-1.06l.81.81v-.044A.75.75 0 0113 3.25zM4.75 9.75a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h13a.75.75 0 000-1.5h-13z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-2xl font-semibold font-sans text-brand-dark-blue">
        CrownKing
      </span>
    </Link>
  );
};

export default Logo;
