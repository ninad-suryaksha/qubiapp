import React, { useEffect } from 'react';
import { QubiAvatar } from './QubiAvatar';
import { sounds } from '../utils/audio';
import { Award, RotateCcw, Sparkles, Compass, Cpu, Layers } from 'lucide-react';

interface CompletionScreenProps {
  onRestart: () => void;
  onGoToAR: () => void;
  onGoToChip: () => void;
  onGoToModules: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onRestart,
  onGoToAR,
  onGoToChip,
  onGoToModules,
}) => {
  useEffect(() => {
    sounds.playSuccess();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 pb-10 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Qubi celebration mascot */}
      <div className="mt-4">
        <QubiAvatar size="hero" mood="excited" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Explorer Certified
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          you're a quantum pioneer!
        </h1>
        <p className="text-stone-600 text-sm max-w-[320px] mx-auto leading-relaxed">
          You mastered all 10 modules: qubits, Bloch spheres, quantum gates, superposition, and entanglement.
        </p>
      </div>

      {/* Certificate Card */}
      <div className="w-full bg-white rounded-3xl p-6 border border-amber-200/80 shadow-[0_4px_24px_rgba(245,135,32,0.1)] flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Award className="w-4 h-4 text-orange-500" />
            <span>Mastery Achievements</span>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            10 / 10 Complete
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col">
            <span className="font-semibold text-stone-800">Bloch Geometry</span>
            <span className="text-[11px] text-stone-500">3D state space</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col">
            <span className="font-semibold text-stone-800">Unitary Gates</span>
            <span className="text-[11px] text-stone-500">X, H, Z rotations</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col">
            <span className="font-semibold text-stone-800">Collapse & Odds</span>
            <span className="text-[11px] text-stone-500">100-shot lab</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col">
            <span className="font-semibold text-stone-800">Entanglement</span>
            <span className="text-[11px] text-stone-500">Bell State correlations</span>
          </div>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="w-full flex flex-col gap-2.5">
        <button
          onClick={onGoToAR}
          className="w-full py-3.5 px-5 bg-[#F58720] hover:bg-[#EA580C] text-stone-950 font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Launch AR Experience Again</span>
        </button>

        <button
          onClick={onGoToChip}
          className="w-full py-3 px-5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Cpu className="w-4 h-4 text-orange-500" />
          <span>Inspect 5x5 Chip Grid</span>
        </button>

        <button
          onClick={onGoToModules}
          className="w-full py-3 px-5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Layers className="w-4 h-4 text-stone-500" />
          <span>Review Any Module</span>
        </button>

        <button
          onClick={onRestart}
          className="text-xs text-stone-400 hover:text-stone-600 flex items-center justify-center gap-1.5 py-2 mt-2 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset all progress</span>
        </button>
      </div>
    </div>
  );
};
