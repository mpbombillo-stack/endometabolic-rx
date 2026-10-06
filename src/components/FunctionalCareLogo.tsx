import React from 'react';

interface FunctionalCareLogoProps {
  variant?: 'full' | 'emblem' | 'horizontal-badge';
  className?: string;
  theme?: 'dark' | 'light' | 'colored';
  height?: number;
}

export const FunctionalCareLogo: React.FC<FunctionalCareLogoProps> = ({
  variant = 'full',
  className = '',
  theme = 'colored',
  height = 42,
}) => {
  // Tree emblem SVG
  const TreeEmblem = ({ size = height }: { size?: number }) => (
    <svg
      width={size * 0.9}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        {/* Golden Trunk Gradient */}
        <linearGradient id="goldTrunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e0b8" />
          <stop offset="40%" stopColor="#d4a359" />
          <stop offset="85%" stopColor="#b37f30" />
          <stop offset="100%" stopColor="#8c5f1c" />
        </linearGradient>

        {/* Leaf Gradients */}
        <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8db67" />
          <stop offset="100%" stopColor="#8ea836" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbe888" />
          <stop offset="100%" stopColor="#9fb941" />
        </linearGradient>
        <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b4cb51" />
          <stop offset="100%" stopColor="#7a9228" />
        </linearGradient>
      </defs>

      {/* --- LEAVES CROWN (Tree Canopy) --- */}
      {/* Top Center Leaf */}
      <path
        d="M 50 4 C 47 12, 48 18, 50 24 C 52 18, 53 12, 50 4 Z"
        fill="url(#leafGrad2)"
      />
      {/* Top Left Leaves */}
      <path
        d="M 43 12 C 38 18, 38 24, 43 28 C 45 23, 46 17, 43 12 Z"
        fill="url(#leafGrad1)"
        transform="rotate(-20 43 20)"
      />
      <path
        d="M 32 18 C 26 23, 26 29, 32 33 C 34 28, 35 23, 32 18 Z"
        fill="url(#leafGrad3)"
        transform="rotate(-40 32 25)"
      />
      <path
        d="M 23 27 C 16 31, 16 37, 22 41 C 25 36, 26 31, 23 27 Z"
        fill="url(#leafGrad1)"
        transform="rotate(-60 22 34)"
      />
      <path
        d="M 17 38 C 10 41, 10 47, 16 51 C 19 46, 20 41, 17 38 Z"
        fill="url(#leafGrad2)"
        transform="rotate(-75 16 44)"
      />
      <path
        d="M 18 51 C 11 53, 11 59, 18 61 C 20 57, 21 53, 18 51 Z"
        fill="url(#leafGrad3)"
        transform="rotate(-90 18 56)"
      />

      {/* Inner Left Leaves */}
      <path
        d="M 37 28 C 32 33, 33 39, 38 42 C 40 37, 40 32, 37 28 Z"
        fill="url(#leafGrad2)"
        transform="rotate(-25 37 35)"
      />
      <path
        d="M 29 40 C 23 44, 24 50, 30 52 C 32 47, 32 43, 29 40 Z"
        fill="url(#leafGrad1)"
        transform="rotate(-45 29 46)"
      />

      {/* Top Right Leaves */}
      <path
        d="M 57 12 C 62 18, 62 24, 57 28 C 55 23, 54 17, 57 12 Z"
        fill="url(#leafGrad1)"
        transform="rotate(20 57 20)"
      />
      <path
        d="M 68 18 C 74 23, 74 29, 68 33 C 66 28, 65 23, 68 18 Z"
        fill="url(#leafGrad2)"
        transform="rotate(40 68 25)"
      />
      <path
        d="M 77 27 C 84 31, 84 37, 78 41 C 75 36, 74 31, 77 27 Z"
        fill="url(#leafGrad3)"
        transform="rotate(60 78 34)"
      />
      <path
        d="M 83 38 C 90 41, 90 47, 84 51 C 81 46, 80 41, 83 38 Z"
        fill="url(#leafGrad1)"
        transform="rotate(75 84 44)"
      />
      <path
        d="M 82 51 C 89 53, 89 59, 82 61 C 80 57, 79 53, 82 51 Z"
        fill="url(#leafGrad2)"
        transform="rotate(90 82 56)"
      />

      {/* Inner Right Leaves */}
      <path
        d="M 63 28 C 68 33, 67 39, 62 42 C 60 37, 60 32, 63 28 Z"
        fill="url(#leafGrad3)"
        transform="rotate(25 63 35)"
      />
      <path
        d="M 71 40 C 77 44, 76 50, 70 52 C 68 47, 68 43, 71 40 Z"
        fill="url(#leafGrad1)"
        transform="rotate(45 71 46)"
      />

      {/* --- ELEGANT GOLDEN FLAME/SPINE TRUNK --- */}
      {/* Main S-shaped graceful spinal trunk */}
      <path
        d="M 50 35 
           C 54 44, 62 50, 61 63 
           C 60 74, 52 78, 48 83 
           C 43 89, 44 95, 47 100 
           C 44 97, 40 92, 41 84 
           C 42 75, 52 69, 53 58 
           C 54 48, 47 42, 50 35 Z"
        fill="url(#goldTrunkGrad)"
      />
      {/* Twin inner flowing curve */}
      <path
        d="M 45 45 
           C 48 52, 53 56, 52 66 
           C 51 75, 44 80, 42 86 
           C 39 92, 40 96, 42 99 
           C 38 95, 36 88, 38 82 
           C 40 73, 46 67, 47 58 
           C 48 50, 43 47, 45 45 Z"
        fill="url(#goldTrunkGrad)"
        opacity="0.9"
      />

      {/* --- SPREADING ROOT ARCS (Base) --- */}
      <path
        d="M 42 85 C 36 90, 26 92, 17 89 C 24 93, 34 94, 40 91 Z"
        fill="url(#goldTrunkGrad)"
      />
      <path
        d="M 43 88 C 38 95, 30 100, 20 99 C 27 103, 36 102, 43 94 Z"
        fill="url(#goldTrunkGrad)"
      />
      <path
        d="M 44 93 C 40 99, 35 105, 27 106 C 35 109, 42 106, 46 98 Z"
        fill="url(#goldTrunkGrad)"
      />

      {/* Right Root Arcs */}
      <path
        d="M 49 85 C 55 90, 65 92, 74 89 C 67 93, 57 94, 51 91 Z"
        fill="url(#goldTrunkGrad)"
      />
      <path
        d="M 48 88 C 53 95, 61 100, 71 99 C 64 103, 55 102, 48 94 Z"
        fill="url(#goldTrunkGrad)"
      />
      <path
        d="M 47 93 C 51 99, 56 105, 64 106 C 56 109, 49 106, 45 98 Z"
        fill="url(#goldTrunkGrad)"
      />
    </svg>
  );

  // If emblem only is requested
  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <TreeEmblem size={height} />
      </div>
    );
  }

  // Horizontal badge variant with emerald background matching image.png
  if (variant === 'horizontal-badge') {
    return (
      <div
        className={`inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#005c55] text-white shadow-sm border border-[#0f766e] ${className}`}
      >
        <TreeEmblem size={height} />
        <div className="flex flex-col text-left">
          <span
            className="text-[17px] font-medium uppercase tracking-[0.16em] text-[#ffffff] leading-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            FUNCTIONAL CARE
          </span>
          <span
            className="text-[8.5px] uppercase tracking-[0.24em] text-[#e0ece8] font-normal leading-tight mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            MEDICINA FUNCIONAL Y REGENERATIVA
          </span>
        </div>
      </div>
    );
  }

  // Full brand lockup (transparent background adapting to container)
  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#005c55';
  const subtextColor = isDark ? '#9cf2e8' : '#3e4947';

  return (
    <div className={`inline-flex items-center gap-2.5 md:gap-3.5 ${className}`}>
      {/* Emblem */}
      <div className="flex items-center justify-center shrink-0">
        <TreeEmblem size={height} />
      </div>

      {/* Typography from Image */}
      <div className="flex flex-col justify-center text-left">
        <span
          className="text-[16px] md:text-[19px] font-semibold uppercase tracking-[0.18em] leading-tight select-none"
          style={{ color: textColor, fontFamily: "'Inter', sans-serif" }}
        >
          FUNCTIONAL CARE
        </span>
        <span
          className="text-[8.5px] md:text-[9.5px] uppercase tracking-[0.24em] font-medium leading-tight mt-0.5 select-none"
          style={{ color: subtextColor, fontFamily: "'Inter', sans-serif" }}
        >
          MEDICINA FUNCIONAL Y REGENERATIVA
        </span>
      </div>
    </div>
  );
};
