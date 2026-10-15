import React from 'react';
import { QubitState } from '../types/quantum';
import { QubitDot } from './QubitDot';
import { sounds } from '../utils/audio';

// Default initial 5x5 pattern matching PDF pages 3 & 4
export const INITIAL_QUBIT_GRID: QubitState[] = [
  'zero', 'one',   'zero',  'zero',  'blend',
  'one',  'zero',  'zero',  'one',   'zero',
  'zero', 'zero',  'blend', 'zero',  'one',
  'one',  'zero',  'one',   'zero',  'zero',
  'zero', 'blend', 'zero',  'one',   'one',
];

// Preset pattern 2 for gate simulation
export const PATTERN_HADAMARD: QubitState[] = [
  'blend', 'blend', 'zero',  'blend', 'one',
  'zero',  'blend', 'one',   'blend', 'blend',
  'blend', 'one',   'blend', 'blend', 'zero',
  'one',   'blend', 'blend', 'zero',  'blend',
  'blend', 'zero',  'blend', 'one',   'blend',
];

// Preset pattern 3 for gate simulation
export const PATTERN_MEASURED: QubitState[] = [
  'zero', 'one',  'zero', 'zero', 'one',
  'one',  'zero', 'zero', 'one',  'zero',
  'zero', 'zero', 'one',  'zero', 'one',
  'one',  'zero', 'one',  'zero', 'zero',
  'zero', 'zero', 'zero', 'one',  'one',
];

interface QubitGridProps {
  grid?: QubitState[];
  selectedQubitIndex?: number | null;
  onSelectQubit?: (index: number) => void;
  showLegend?: boolean;
  size?: 'sm' | 'md' | 'compact';
  interactive?: boolean;
  className?: string;
}

export const QubitGrid: React.FC<QubitGridProps> = ({
  grid = INITIAL_QUBIT_GRID,
  selectedQubitIndex = null,
  onSelectQubit,
  showLegend = true,
  size = 'md',
  interactive = true,
  className = '',
}) => {
  const handleDotClick = (index: number) => {
    if (!interactive) return;
    const state = grid[index] || 'zero';
    sounds.playQubitTap(state);
    if (onSelectQubit) {
      onSelectQubit(index);
    }
  };

  const isMini = size === 'sm';
  const isCompact = size === 'compact';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Grid Container Card with Rich Gradient & Circuit Sheen */}
      <div
        className={`relative overflow-hidden bg-gradient-to-b from-white via-[#FCFBF8] to-[#FFF7ED] rounded-[32px] border border-amber-200/80 shadow-[0_8px_32px_rgba(245,135,32,0.07)] flex flex-col items-center justify-center transition-all ${
          isMini
            ? 'p-3 rounded-2xl border-stone-200'
            : isCompact
            ? 'p-4 w-full max-w-[320px] aspect-square rounded-[28px]'
            : 'p-6 w-full max-w-[360px] aspect-square'
        }`}
      >
        {/* Ambient radial glow behind the qubits */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,215,170,0.3)_0%,transparent_70%)] pointer-events-none" />

        {/* Subtle microscopic circuit trace lines */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none" />
        <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-amber-300/40 to-transparent pointer-events-none" />

        <div
          className={`relative z-10 grid grid-cols-5 ${
            isMini
              ? 'gap-2'
              : isCompact
              ? 'gap-3 w-full h-full place-items-center'
              : 'gap-4 w-full h-full place-items-center'
          }`}
        >
          {grid.map((state, index) => {
            const isSelected = selectedQubitIndex === index;
            return (
              <QubitDot
                key={index}
                state={state}
                size={isMini ? 'xs' : isCompact ? 'sm' : 'md'}
                isSelected={isSelected}
                isInteractive={interactive}
                onClick={() => handleDotClick(index)}
                className="transition-transform duration-100"
              />
            );
          })}
        </div>
      </div>

      {/* Legend at bottom */}
      {showLegend && !isMini && (
        <div className="flex items-center justify-center gap-6 mt-3.5 text-xs font-normal text-stone-600 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">
          <div className="flex items-center gap-2">
            <QubitDot state="zero" size="xs" glow={false} />
            <span className="font-medium text-stone-700">zero</span>
          </div>
          <div className="flex items-center gap-2">
            <QubitDot state="one" size="xs" glow={false} />
            <span className="font-medium text-stone-700">one</span>
          </div>
          <div className="flex items-center gap-2">
            <QubitDot state="blend" size="xs" glow={false} />
            <span className="font-medium text-stone-700">blend</span>
          </div>
        </div>
      )}
    </div>
  );
};
