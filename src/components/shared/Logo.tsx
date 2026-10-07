import React from 'react';
import { Link } from '@/lib/router-compat';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  const src = variant === 'light' ? logoLight : logoDark;

  return (
    <Link to="/" className={`hover:opacity-80 transition-opacity ${className}`}>
      <img
        src={src}
        alt="Hills Camp"
        className="h-10 md:h-12 w-auto"
      />
    </Link>
  );
};
