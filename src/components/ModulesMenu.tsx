import React from 'react';
import { QubiBubble } from './QubiBubble';
import { sounds } from '../utils/audio';
import { Check, Lock, Play, Sparkles, Unlock } from 'lucide-react';

export interface ModuleItem {
  id: number;
  title: string;
  subtitle?: string;
}

export const MODULE_LIST: ModuleItem[] = [
  { id: 1, title: 'what is quantum computing?' },
  { id: 2, title: 'how it works' },
  { id: 3, title: 'what are qubits?' },
  { id: 4, title: 'the math, in plain words' },
  { id: 5, title: 'state representations' },
  { id: 6, title: 'quantum gates' },
  { id: 7, title: 'superposition and measurement' },
  { id: 8, title: 'entanglement' },
  { id: 9, title: 'quantum algorithms' },
  { id: 10, title: 'real-world uses' },
];

interface ModulesMenuProps {
  completedModules: number[];
  unlockedMax: number;
  onSelectModule: (moduleId: number) => void;
  onBackToChip?: () => void;
}

export const ModulesMenu: React.FC<ModulesMenuProps> = ({
  completedModules,
  unlockedMax,
  onSelectModule,
  onBackToChip,
}) => {
  const [unlockAll, setUnlockAll] = React.useState(false);

  const handleModuleClick = (id: number) => {
    const isUnlocked = unlockAll || id <= unlockedMax || completedModules.includes(id) || id === 1;
    if (!isUnlocked) {
      sounds.playClick(200, 0.08);
      return;
    }
    sounds.playClick();
    onSelectModule(id);
  };

  return (
    <div className="flex flex-col gap-5 pb-8 animate-in fade-in duration-200">
      {/* Top Header matching PDF page 5 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-stone-500 text-sm font-normal">
          <span>10 modules</span>
          <button
            onClick={() => {
              sounds.playClick();
              setUnlockAll(!unlockAll);
            }}
            className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-0.5 rounded-full hover:bg-orange-50 transition-colors"
            title="Toggle unlock all modules for freeform exploration"
          >
            {unlockAll ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span>{unlockAll ? 'All Unlocked' : 'Free Explore'}</span>
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          choose where to start
        </h1>
      </div>

      {/* Qubi Bubble matching PDF page 5 */}
      <QubiBubble message="i'm qubi. i'll guide you through all ten." />

      {/* Module List matching PDF page 5 */}
      <div className="flex flex-col gap-2.5">
        {MODULE_LIST.map((item) => {
          const isCompleted = completedModules.includes(item.id);
          const isUnlocked = unlockAll || item.id <= unlockedMax || isCompleted || item.id === 1;
          const isNext = !isCompleted && isUnlocked;

          return (
            <div
              key={item.id}
              onClick={() => handleModuleClick(item.id)}
              className={`w-full py-4 px-4 rounded-2xl border transition-all flex items-center justify-between group ${
                isUnlocked
                  ? 'bg-white hover:bg-orange-50/40 border-stone-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer active:scale-[0.99]'
                  : 'bg-stone-50/70 border-stone-200/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Number Circle matching PDF page 5 */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isUnlocked
                      ? 'bg-[#F58720] text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : item.id}
                </div>

                {/* Module Title */}
                <span
                  className={`text-base font-medium transition-colors ${
                    isUnlocked ? 'text-stone-900 group-hover:text-orange-950' : 'text-stone-400'
                  }`}
                >
                  {item.title}
                </span>
              </div>

              {/* Status Tag on Right matching PDF page 5 */}
              <div className="text-xs font-medium shrink-0">
                {isCompleted ? (
                  <span className="text-emerald-600 font-semibold">completed</span>
                ) : isNext ? (
                  <span className="text-stone-500 group-hover:text-orange-600 font-medium">start</span>
                ) : (
                  <span className="text-stone-400">locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
