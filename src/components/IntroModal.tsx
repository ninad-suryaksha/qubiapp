import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { QubiAvatar } from './QubiAvatar';
import { sounds } from '../utils/audio';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishIntro: () => void;
}

const INTRO_SLIDES = [
  {
    time: 0,
    title: 'The Cryogenic Chandelier',
    text: 'Quantum computers operate at nearly absolute zero (-273°C), colder than outer space, to keep qubits undisturbed.',
    highlight: '15 milliKelvin',
  },
  {
    time: 8,
    title: 'The Quantum Processor',
    text: 'At the very base of the gold chandelier sits the silicon chip containing microscopic superconducting circuits.',
    highlight: 'Superconducting Chip',
  },
  {
    time: 16,
    title: 'Bits vs. Qubits',
    text: 'Unlike classic bits locked in 0 or 1, qubits exist in a shimmering blend called superposition until measured.',
    highlight: 'Superposition',
  },
  {
    time: 24,
    title: 'Entangled Power',
    text: 'By linking qubits together through entanglement, quantum computers explore vast possibilities simultaneously.',
    highlight: 'Exponential Scaling',
  },
];

export const IntroModal: React.FC<IntroModalProps> = ({
  isOpen,
  onClose,
  onFinishIntro,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 30) {
          setIsPlaying(false);
          return 30;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  // Find active slide
  const activeSlide =
    INTRO_SLIDES.slice()
      .reverse()
      .find((s) => seconds >= s.time) || INTRO_SLIDES[0];

  const handleRestart = () => {
    sounds.playClick();
    setSeconds(0);
    setIsPlaying(true);
  };

  const handleComplete = () => {
    sounds.playSuccess();
    onFinishIntro();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-[32px] w-full max-w-[420px] overflow-hidden border border-amber-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Quantum Intro
            </span>
            <span className="text-xs text-stone-400 font-mono">
              0:{seconds < 10 ? `0${seconds}` : seconds} / 0:30
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Animation Area */}
        <div className="relative h-48 bg-gradient-to-b from-[#FFF5E6] to-[#FFE0B2] flex items-center justify-center overflow-hidden">
          {/* Radial Pulse */}
          <div className="absolute w-60 h-60 rounded-full bg-orange-300/30 animate-pulse pointer-events-none" />

          {/* Qubi Host */}
          <div className="relative z-10 flex flex-col items-center">
            <QubiAvatar size="lg" mood="excited" />
            <span className="mt-2 text-xs font-mono font-semibold px-2.5 py-0.5 bg-white/90 text-orange-950 rounded-full shadow-sm">
              {activeSlide.highlight}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col gap-3">
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            {activeSlide.title}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed min-h-[54px]">
            {activeSlide.text}
          </p>

          {/* Timeline progress line */}
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-orange-500 h-full transition-all duration-300 ease-linear rounded-full"
              style={{ width: `${(seconds / 30) * 100}%` }}
            />
          </div>

          {/* Media controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleComplete}
              className="px-5 py-2.5 bg-[#F58720] hover:bg-[#EA580C] text-white text-sm font-semibold rounded-2xl shadow-md active:scale-95 transition-all"
            >
              {seconds >= 30 ? 'Launch AR Experience' : 'Skip to AR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
