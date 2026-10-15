import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Search, ShieldAlert, Waves, ArrowRight } from 'lucide-react';

export const AlgorithmVisualizer: React.FC = () => {
  const [listSize, setListSize] = useState<number>(1000000);
  const [factorNum, setFactorNum] = useState<number>(15);

  const classicalSteps = Math.floor(listSize / 2);
  const quantumSteps = Math.floor(Math.sqrt(listSize));
  const speedupRatio = Math.round(classicalSteps / (quantumSteps || 1));

  const factoringPairs: Record<number, string> = {
    15: '3 × 5',
    21: '3 × 7',
    35: '5 × 7',
    77: '7 × 11',
    143: '11 × 13',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* The Big Idea Card (matching PDF page 14) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-2">
        <h3 className="text-base font-bold text-stone-900">the big idea</h3>
        <p className="text-sm text-stone-600">
          make wrong answers cancel out and right answers add up.
        </p>

        {/* Interference wave preview */}
        <div className="mt-2 bg-amber-50/50 p-3.5 rounded-2xl border border-orange-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <Waves className="w-4 h-4 text-orange-500" />
            <span>Wrong answers cancel (destructive interference)</span>
          </div>
          <span className="font-mono text-emerald-700 font-semibold">+ Correct peak</span>
        </div>
      </div>

      {/* Search (Grover's Algorithm) Card (matching PDF page 14) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">search</h3>
          <p className="text-sm text-stone-600 mt-0.5">
            find an item in a big list in fewer steps.
          </p>
        </div>

        {/* Interactive List Size Slider */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between text-xs text-stone-500">
            <span>List size:</span>
            <span className="font-mono font-semibold text-stone-800">
              {listSize.toLocaleString()} items
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={listSize}
            onChange={(e) => {
              setListSize(Number(e.target.value));
              sounds.playClick(500, 0.015);
            }}
            className="w-full accent-[#F58720] cursor-pointer"
          />
        </div>

        {/* Step Comparison */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70 flex flex-col">
            <span className="text-[11px] text-stone-500 font-medium">Normal Computer</span>
            <span className="text-base font-bold font-mono text-stone-800 mt-0.5">
              ~{classicalSteps.toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-400">average steps</span>
          </div>
          <div className="bg-orange-50 p-3 rounded-2xl border border-orange-200/80 flex flex-col">
            <span className="text-[11px] text-orange-800 font-medium">Quantum (Grover)</span>
            <span className="text-base font-bold font-mono text-orange-600 mt-0.5">
              ~{quantumSteps.toLocaleString()}
            </span>
            <span className="text-[10px] text-orange-500 font-semibold">
              {speedupRatio}× faster!
            </span>
          </div>
        </div>
      </div>

      {/* Factoring (Shor's Algorithm) Card (matching PDF page 14) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">factoring</h3>
          <p className="text-sm text-stone-600 mt-0.5">
            break huge numbers into primes. this is why people talk about security.
          </p>
        </div>

        {/* Interactive Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[15, 21, 35, 77, 143].map((num) => (
            <button
              key={num}
              onClick={() => {
                setFactorNum(num);
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
                factorNum === num
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              N = {num}
            </button>
          ))}
        </div>

        <div className="bg-amber-50/60 p-3 rounded-2xl border border-orange-100 flex items-center justify-between text-xs">
          <span className="text-stone-600">Prime factors:</span>
          <span className="font-mono font-bold text-orange-700 text-sm">
            {factorNum} = {factoringPairs[factorNum]}
          </span>
        </div>
      </div>
    </div>
  );
};
