import React from 'react';
import { QubitState } from '../types/quantum';

interface QubitDotProps {
  state: QubitState;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean;
  isInteractive?: boolean;
  onClick?: () => void;
  className?: string;
  glow?: boolean;
}

export const QubitDot: React.FC<QubitDotProps> = ({
  state,
  size = 'md',
  isSelected = false,
  isInteractive = false,
  onClick,
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const ringPadding = {
    xs: 'p-[2px]',
    sm: 'p-[3px]',
    md: 'p-1',
    lg: 'p-1.5',
    xl: 'p-2',
  };

  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      className={`relative inline-flex items-center justify-center shrink-0 ${
        isInteractive ? 'cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      {/* Selection Black Ring (as shown on page 4) */}
      {isSelected && (
        <div
          className={`absolute inset-[-4px] rounded-full border-2 border-stone-900 pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95`}
        />
      )}

      {/* Zero State: clean neutral light grey dot */}
      {state === 'zero' && (
        <div
          className={`rounded-full bg-[#E5E3DF] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] ${sizeMap[size]}`}
        />
      )}

      {/* One State: vibrant glowing orange dot */}
      {state === 'one' && (
        <div
          className={`rounded-full bg-[#F58720] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] ${sizeMap[size]} ${
            glow ? 'qubit-dot-glow' : ''
          }`}
          style={{
            boxShadow: glow ? '0 0 14px 4px rgba(245, 135, 32, 0.45)' : undefined,
          }}
        />
      )}

      {/* Blend State: split dot (left half orange, right half light cream/gray) */}
      {state === 'blend' && (
        <div
          className={`rounded-full overflow-hidden relative ${sizeMap[size]} ${
            glow ? 'qubit-dot-glow-subtle' : ''
          }`}
          style={{
            boxShadow: glow ? '0 0 10px 2px rgba(245, 135, 32, 0.25)' : undefined,
          }}
        >
          {/* Left half: Orange */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[#F58720]" />
          {/* Right half: Light cream/gray */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[#F6D59C]" />
          {/* Subtle vertical divider line */}
          <div className="absolute inset-y-0 left-1/2 w-[0.5px] bg-orange-700/20" />
        </div>
      )}
    </div>
  );
};
