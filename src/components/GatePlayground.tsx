import React, { useState } from 'react';
import { QubitDot } from './QubitDot';
import { QubitState } from '../types/quantum';
import { sounds } from '../utils/audio';
import { RotateCcw, Sparkles } from 'lucide-react';

export const GatePlayground: React.FC = () => {
  const [activeState, setActiveState] = useState<QubitState>('zero');
  const [phase, setPhase] = useState<number>(0); // 0 or Math.PI (180 deg)
  const [history, setHistory] = useState<string[]>([]);

  // Apply Pauli-X Gate (NOT gate: |0> -> |1>, |1> -> |0>)
  const applyX = () => {
    sounds.playGate();
    setHistory((prev) => [...prev, 'X']);
    setActiveState((curr) => {
      if (curr === 'zero') return 'one';
      if (curr === 'one') return 'zero';
      return 'blend'; // X on (|0>+|1>)/sqrt(2) remains (|1>+|0>)/sqrt(2)
    });
  };

  // Apply Hadamard H Gate (creates/collapses superposition)
  const applyH = () => {
    sounds.playGate();
    setHistory((prev) => [...prev, 'H']);
    setActiveState((curr) => {
      if (curr === 'zero' || curr === 'one') return 'blend';
      return phase === Math.PI ? 'one' : 'zero';
    });
  };

  // Apply Pauli-Z Gate (phase flip: changes phase of |1> by 180 degrees)
  const applyZ = () => {
    sounds.playGate();
    setHistory((prev) => [...prev, 'Z']);
    setPhase((p) => (p === 0 ? Math.PI : 0));
  };

  const handleReset = () => {
    sounds.playClick();
    setActiveState('zero');
    setPhase(0);
    setHistory([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Live Interactive Sandbox Box */}
      <div className="bg-gradient-to-b from-amber-50/70 to-orange-50/30 rounded-3xl p-5 border border-orange-200/60 shadow-[0_4px_20px_rgba(249,115,22,0.06)] flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Live Qubit Simulator
          </span>
          <button
            onClick={handleReset}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Live Qubit Display */}
        <div className="my-2 flex flex-col items-center">
          <QubitDot state={activeState} size="xl" />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm font-bold text-stone-800">
              State: {activeState}
            </span>
            {phase === Math.PI && activeState === 'blend' && (
              <span className="text-xs font-mono px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full font-medium">
                Phase: -π
              </span>
            )}
          </div>
          <span className="text-xs text-stone-500 mt-0.5">
            {activeState === 'zero' && '100% chance of reading 0 (dark)'}
            {activeState === 'one' && '100% chance of reading 1 (lit)'}
            {activeState === 'blend' && '50% zero / 50% one (superposition)'}
          </span>
        </div>

        {/* Gate Action Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4">
          <button
            onClick={applyX}
            className="py-2.5 px-3 bg-white hover:bg-orange-50 border border-orange-200 rounded-2xl flex flex-col items-center shadow-sm active:scale-95 transition-all"
          >
            <span className="text-base font-bold font-mono text-orange-600">X Gate</span>
            <span className="text-[11px] text-stone-500">Flip Bit</span>
          </button>
          <button
            onClick={applyH}
            className="py-2.5 px-3 bg-white hover:bg-orange-50 border border-orange-200 rounded-2xl flex flex-col items-center shadow-sm active:scale-95 transition-all"
          >
            <span className="text-base font-bold font-mono text-orange-600">H Gate</span>
            <span className="text-[11px] text-stone-500">Blend Mix</span>
          </button>
          <button
            onClick={applyZ}
            className="py-2.5 px-3 bg-white hover:bg-orange-50 border border-orange-200 rounded-2xl flex flex-col items-center shadow-sm active:scale-95 transition-all"
          >
            <span className="text-base font-bold font-mono text-orange-600">Z Gate</span>
            <span className="text-[11px] text-stone-500">Phase Shift</span>
          </button>
        </div>

        {/* Applied Gates History Strip */}
        <div className="w-full mt-3 pt-2 border-t border-orange-100 flex items-center justify-between text-xs text-stone-500">
          <span>Applied gates:</span>
          <div className="flex gap-1 font-mono font-medium text-orange-800">
            {history.length === 0 ? 'None (Ground State)' : history.join(' → ')}
          </div>
        </div>
      </div>
    </div>
  );
};
