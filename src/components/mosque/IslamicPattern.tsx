import React from 'react';

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
}

export const IslamicPattern: React.FC<IslamicPatternProps> = ({ 
  className = '', 
  opacity = 0.03 
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern 
            id="islamic-pattern" 
            x="0" 
            y="0" 
            width="20" 
            height="20" 
            patternUnits="userSpaceOnUse"
          >
            {/* 8-pointed star pattern */}
            <path
              d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-primary"
            />
            <circle
              cx="10"
              cy="10"
              r="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-secondary"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );
};
