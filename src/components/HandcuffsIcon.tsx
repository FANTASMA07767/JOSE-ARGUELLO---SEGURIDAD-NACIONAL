import React from 'react';

interface HandcuffsIconProps {
  className?: string;
  size?: number;
}

export const HandcuffsIcon: React.FC<HandcuffsIconProps> = ({ className = 'w-5 h-5', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left cuff */}
      <circle cx="7" cy="15" r="4.5" />
      <path d="M7 10.5V8.5A2 2 0 0 1 9 6.5" />
      <circle cx="7" cy="15" r="1.5" />
      
      {/* Right cuff */}
      <circle cx="17" cy="15" r="4.5" />
      <path d="M17 10.5V8.5A2 2 0 0 0 15 6.5" />
      <circle cx="17" cy="15" r="1.5" />
      
      {/* Central linking chain */}
      <line x1="9" y1="6.5" x2="15" y2="6.5" />
      <line x1="10.5" y1="5.2" x2="13.5" y2="5.2" />
    </svg>
  );
};
