import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {/* Logo Text */}
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light italic text-brand-blue-dark">
          CrownKing
        </span>
        <span className="text-xs uppercase tracking-widest text-brand-blue-dark bg-white px-2 -mt-1">
          SINCE 1978
        </span>
      </div>
    </Link>
  );
};

export default Logo;
