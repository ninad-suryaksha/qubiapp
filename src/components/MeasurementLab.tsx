import React, { useState } from 'react';
import { QubitDot } from './QubitDot';
import { QubitState } from '../types/quantum';
import { sounds } from '../utils/audio';
import { Play, RotateCcw, Eye } from 'lucide-react';

export const MeasurementLab: React.FC = () => {
  const [singleState, setSingleState] = useState<QubitState>('blend');
  const [measuredCountZero, setMeasuredCountZero] = useState(52);
  const [measuredCountOne, setMeasuredCountOne] = useState(48);
  const [isRunning100, setIsRunning100] = useState(false);

  const handleSingleMeasure = () => {
    sounds.playMeasure();
    // 50% chance 0 or 1
    const outcome: QubitState = Math.random() < 0.5 ? 'zero' : 'one';
    setSingleState(outcome);
  };

  const handleResetSingle = () => {
    sounds.playClick();
    setSingleState('blend');
  };

  const handleRun100 = () => {
    sounds.playGate();
    setIsRunning100(true);

    let countZero = 0;
    let countOne = 0;
    for (let i = 0; i < 100; i++) {
      if (Math.random() < 0.5) countZero++;
      else countOne++;
    }

    // Animate the counters up
    let step = 0;
    const interval = setInterval(() => {
      step += 5;
      const progress = step / 100;
      setMeasuredCountZero(Math.round(countZero * progress));
      setMeasuredCountOne(Math.round(countOne * progress));

      if (step >= 100) {
        clearInterval(interval);
        setMeasuredCountZero(countZero);
        setMeasuredCountOne(countOne);
        setIsRunning100(false);
        sounds.playSuccess();
      }
    }, 20);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Card 1 & 2: Before & After Looking (matching PDF page 12) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">before looking</h3>
          <p className="text-sm text-stone-600 mt-0.5">the qubit is a blend.</p>
          <div className="flex items-center gap-3 mt-3">
            <QubitDot state="blend" size="md" />
            <span className="text-xs text-stone-500">blend</span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-stone-900">after looking</h3>
              <p className="text-sm text-stone-600 mt-0.5">
                it snaps to one answer, picked by chance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2.5">
              <QubitDot state={singleState} size="md" />
              <span className="text-xs font-semibold text-stone-700 capitalize">
                {singleState === 'blend' ? 'unmeasured' : singleState}
              </span>
            </div>

            {singleState === 'blend' ? (
              <button
                onClick={handleSingleMeasure}
                className="ml-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                Look Now
              </button>
            ) : (
              <button
                onClick={handleResetSingle}
                className="ml-auto px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Blend
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Repeat 100 Times (exact visual from PDF page 12) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-stone-900">repeat 100 times</h3>
            <p className="text-sm text-stone-600 mt-0.5">the results reveal the odds.</p>
          </div>
          <button
            onClick={handleRun100}
            disabled={isRunning100}
            className="px-3 py-1.5 bg-[#F58720] hover:bg-[#EA580C] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            {isRunning100 ? 'Running...' : 'Run 100'}
          </button>
        </div>

        {/* Dual Bar Graphic exactly as shown in PDF page 12 */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {/* Zero bar (darker orange) */}
          <div className="bg-[#F58720] text-white p-3.5 rounded-2xl flex flex-col justify-between shadow-sm transition-all">
            <span className="text-xs font-medium text-white/90">zero:</span>
            <span className="text-2xl font-bold font-mono tracking-tight mt-1">
              {measuredCountZero}
            </span>
          </div>

          {/* One bar (lighter amber) */}
          <div className="bg-[#FCD385] text-stone-900 p-3.5 rounded-2xl flex flex-col justify-between shadow-sm transition-all">
            <span className="text-xs font-medium text-stone-700">one:</span>
            <span className="text-2xl font-bold font-mono tracking-tight mt-1">
              {measuredCountOne}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
