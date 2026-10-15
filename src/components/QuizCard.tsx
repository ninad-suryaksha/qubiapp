import React, { useState } from 'react';
import { QubitDot } from './QubitDot';
import { QubitState } from '../types/quantum';
import { sounds } from '../utils/audio';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  targetState: QubitState;
  prompt: string;
  options: {
    label: string;
    sublabel: string;
    correct: boolean;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    targetState: 'blend',
    prompt: 'Which Dirac notation matches this half-and-half blend?',
    options: [
      { label: '|0⟩', sublabel: '[1, 0]', correct: false },
      { label: '(|0⟩ + |1⟩) / √2', sublabel: '[0.71, 0.71]', correct: true },
      { label: '|1⟩', sublabel: '[0, 1]', correct: false },
    ],
  },
  {
    targetState: 'one',
    prompt: 'Which vector representation matches this lit qubit?',
    options: [
      { label: '[1, 0]', sublabel: '|0⟩', correct: false },
      { label: '[0, 1]', sublabel: '|1⟩', correct: true },
      { label: '[0.71, 0.71]', sublabel: 'blend', correct: false },
    ],
  },
  {
    targetState: 'zero',
    prompt: 'Which symbol represents the dark, unexcited ground state?',
    options: [
      { label: '|0⟩', sublabel: '[1, 0]', correct: true },
      { label: '|1⟩', sublabel: '[0, 1]', correct: false },
      { label: '(|0⟩ - |1⟩) / √2', sublabel: 'phase', correct: false },
    ],
  },
];

export const QuizCard: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (currentQ.options[optIdx].correct) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playClick(240, 0.1);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Finished quiz
      setCurrentIdx(0);
      setSelectedOpt(null);
      setIsAnswered(false);
      setScore(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide uppercase text-orange-600">
          Mini-Quiz • Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
        </span>
        <span className="text-xs font-medium text-stone-500">
          Score: {score}/{QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="flex items-center gap-4 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100">
        <QubitDot state={currentQ.targetState} size="md" />
        <p className="text-sm font-medium text-stone-800 leading-snug">
          {currentQ.prompt}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {currentQ.options.map((opt, idx) => {
          let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';
          if (isAnswered) {
            if (opt.correct) {
              btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-2 ring-emerald-400/40';
            } else if (selectedOpt === idx) {
              btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through opacity-80';
            } else {
              btnStyle = 'bg-stone-50/50 border-stone-100 text-stone-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full py-2.5 px-4 rounded-xl border text-sm flex items-center justify-between transition-all active:scale-[0.99] ${btnStyle}`}
            >
              <span className="font-mono">{opt.label}</span>
              <span className="text-xs opacity-75">{opt.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Answer feedback */}
      {isAnswered && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-medium text-stone-600">
            {currentQ.options[selectedOpt!].correct
              ? '✓ Perfect match!'
              : `The correct representation is ${currentQ.options.find((o) => o.correct)?.label}`}
          </p>
          <button
            onClick={handleNext}
            className="px-3 py-1.5 bg-[#F58720] hover:bg-[#EA580C] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Restart Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};
