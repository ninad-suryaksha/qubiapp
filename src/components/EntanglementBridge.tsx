import React, { useState } from 'react';
import { QubitDot } from './QubitDot';
import { QubitState } from '../types/quantum';
import { sounds } from '../utils/audio';
import { Link2, RotateCcw, Zap } from 'lucide-react';

export const EntanglementBridge: React.FC = () => {
  const [qubitA, setQubitA] = useState<QubitState>('blend');
  const [qubitB, setQubitB] = useState<QubitState>('blend');
  const [measurementCount, setMeasurementCount] = useState(0);

  const handleMeasureA = () => {
    sounds.playMeasure();
    // In entangled Bell state (|00> + |11>)/sqrt(2), both must collapse to same value!
    const outcome: QubitState = Math.random() < 0.5 ? 'one' : 'zero';
    setQubitA(outcome);
    setQubitB(outcome);
    setMeasurementCount((c) => c + 1);
  };

  const handleMeasureB = () => {
    sounds.playMeasure();
    const outcome: QubitState = Math.random() < 0.5 ? 'one' : 'zero';
    setQubitA(outcome);
    setQubitB(outcome);
    setMeasurementCount((c) => c + 1);
  };

  const handleReEntangle = () => {
    sounds.playGate();
    setQubitA('blend');
    setQubitB('blend');
  };

  const isBlended = qubitA === 'blend';

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-stone-900">linked qubits</h3>
        <p className="text-sm text-stone-600 mt-0.5">
          measure one and you instantly know how the other will read.
        </p>
      </div>

      {/* Linked Qubits Graphic (exact visual from PDF page 13) */}
      <div className="relative py-8 px-4 flex items-center justify-center gap-12 bg-amber-50/40 rounded-2xl border border-orange-100">
        {/* Entanglement Line connecting both */}
        <div className="absolute inset-x-20 top-1/2 -translate-y-1/2 h-[3.5px] bg-[#F58720] rounded-full shadow-[0_0_10px_rgba(245,135,32,0.5)] z-0">
          {/* Subtle moving quantum entanglement particle */}
          <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-sm animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>

        {/* Qubit A */}
        <div
          onClick={handleMeasureA}
          className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="transition-transform group-hover:scale-110 active:scale-95">
            <QubitDot state={qubitA} size="lg" />
          </div>
          <span className="text-xs font-semibold text-stone-700">Qubit A</span>
          <span className="text-[11px] text-orange-600 font-medium">
            {isBlended ? 'tap to measure' : `snapped to ${qubitA}`}
          </span>
        </div>

        {/* Qubit B */}
        <div
          onClick={handleMeasureB}
          className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="transition-transform group-hover:scale-110 active:scale-95">
            <QubitDot state={qubitB} size="lg" />
          </div>
          <span className="text-xs font-semibold text-stone-700">Qubit B</span>
          <span className="text-[11px] text-orange-600 font-medium">
            {isBlended ? 'tap to measure' : `snapped to ${qubitB}`}
          </span>
        </div>
      </div>

      {/* Control Actions & Explanation */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-stone-500">
          {isBlended
            ? 'Superposition: both qubits share a linked fate.'
            : `Pair collapsed to |${qubitA === 'one' ? '11' : '00'}⟩!`}
        </span>
        <button
          onClick={handleReEntangle}
          className="px-3 py-1.5 bg-[#F58720] hover:bg-[#EA580C] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          Re-Entangle
        </button>
      </div>
    </div>
  );
};
