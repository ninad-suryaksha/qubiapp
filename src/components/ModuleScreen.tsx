import React, { useState } from 'react';
import { QubiBubble } from './QubiBubble';
import { QubitDot } from './QubitDot';
import { QubitGrid, INITIAL_QUBIT_GRID, PATTERN_HADAMARD, PATTERN_MEASURED } from './QubitGrid';
import { BlochSphere } from './BlochSphere';
import { QuizCard } from './QuizCard';
import { GatePlayground } from './GatePlayground';
import { MeasurementLab } from './MeasurementLab';
import { EntanglementBridge } from './EntanglementBridge';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { sounds } from '../utils/audio';
import { QubitState } from '../types/quantum';
import {
  Play,
  Sparkles,
  Atom,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Cpu,
  BookOpen,
} from 'lucide-react';

interface ModuleScreenProps {
  moduleId: number;
  onNext: () => void;
  onPrev?: () => void;
  onSelectModule: (id: number) => void;
  onViewAR?: () => void;
}

export const ModuleScreen: React.FC<ModuleScreenProps> = ({
  moduleId,
  onNext,
  onPrev,
  onSelectModule,
  onViewAR,
}) => {
  // Toggle between Lesson view and direct Chip view
  const [activeTab, setActiveTab] = useState<'lesson' | 'chip'>('lesson');

  // Local grid for direct chip experimentation inside the module
  const [moduleGrid, setModuleGrid] = useState<QubitState[]>(INITIAL_QUBIT_GRID);
  const [selectedChipQubit, setSelectedChipQubit] = useState<number | null>(13);

  // Module 1 interactive bit switch
  const [bitSwitchState, setBitSwitchState] = useState<'zero' | 'one'>('zero');

  // Module 2 interactive pipeline animation
  const [pipelineStep, setPipelineStep] = useState(0);

  // Module 4 interactive dimmer
  const [alphaVal, setAlphaVal] = useState(50);
  const betaVal = 100 - alphaVal;

  const nextTitles: Record<number, string> = {
    1: 'next: how it works',
    2: 'next: what are qubits?',
    3: 'next: the math',
    4: 'next: representations',
    5: 'next: quantum gates',
    6: 'next: measurement',
    7: 'next: entanglement',
    8: 'next: algorithms',
    9: 'next: real-world uses',
    10: 'finish modules',
  };

  const handleNextClick = () => {
    sounds.playClick();
    onNext();
  };

  const handlePrevClick = () => {
    sounds.playClick();
    if (onPrev) onPrev();
  };

  // Run pipeline step animation in Module 2
  const runPipelineAnimation = () => {
    sounds.playGate();
    setPipelineStep(1);
    setTimeout(() => {
      setPipelineStep(2);
      sounds.playGate();
    }, 900);
    setTimeout(() => {
      setPipelineStep(3);
      sounds.playMeasure();
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 animate-in fade-in duration-200">
      {/* Top Header & Integrated View Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
            <span>module {moduleId} of 10</span>
          </div>

          {/* Quick Tab Switcher: Lesson vs Live 5x5 Chip */}
          <div className="flex items-center bg-amber-100/60 p-0.5 rounded-full border border-amber-200/60 text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('lesson');
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all ${
                activeTab === 'lesson'
                  ? 'bg-white text-orange-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3 h-3 text-orange-500" />
              <span>Lesson</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('chip');
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all ${
                activeTab === 'chip'
                  ? 'bg-white text-orange-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Cpu className="w-3 h-3 text-orange-500" />
              <span>Live Chip</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-[28px] font-extrabold text-stone-900 tracking-tight leading-tight">
          {moduleId === 1 && 'what is quantum computing?'}
          {moduleId === 2 && 'how it works'}
          {moduleId === 3 && 'what are qubits?'}
          {moduleId === 4 && 'the math, in plain words'}
          {moduleId === 5 && 'state representations'}
          {moduleId === 6 && 'quantum gates'}
          {moduleId === 7 && 'superposition and measurement'}
          {moduleId === 8 && 'entanglement'}
          {moduleId === 9 && 'quantum algorithms'}
          {moduleId === 10 && 'real-world uses'}
        </h1>
      </div>

      {/* Qubi Bubble with contextual guidance */}
      <QubiBubble
        message={
          activeTab === 'chip'
            ? `this is the 5x5 chip running module ${moduleId}. tap any qubit to interact directly.`
            : moduleId === 1
            ? "a normal computer uses bits. we'll use qubits."
            : moduleId === 2
            ? 'three steps: prepare, apply gates, measure.'
            : moduleId === 3
            ? "a qubit's state is like an arrow on a sphere."
            : moduleId === 4
            ? 'two numbers say how much zero and how much one.'
            : moduleId === 5
            ? 'one state, three ways to write it.'
            : moduleId === 6
            ? 'gates are the buttons we press on a qubit.'
            : moduleId === 7
            ? 'looking changes the answer.'
            : moduleId === 8
            ? 'two qubits, one shared story.'
            : moduleId === 9
            ? 'clever recipes that use blends and links.'
            : 'where this is heading.'
        }
      />

      {/* ================= IF ACTIVE TAB IS CHIP: LIVE PROCESSOR INTERACTION ================= */}
      {activeTab === 'chip' ? (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          <div className="bg-gradient-to-b from-white via-white to-amber-50/50 rounded-3xl p-4 border border-amber-200/80 shadow-sm flex flex-col items-center">
            <QubitGrid
              grid={moduleGrid}
              selectedQubitIndex={selectedChipQubit}
              onSelectQubit={(idx) => {
                setSelectedChipQubit(idx);
                // Invert state on tap
                setModuleGrid((curr) => {
                  const next = [...curr];
                  const current = next[idx];
                  next[idx] = current === 'zero' ? 'blend' : current === 'blend' ? 'one' : 'zero';
                  return next;
                });
              }}
              showLegend={true}
              size="compact"
            />
          </div>

          {/* Quick Chip Controls */}
          <div className="bg-white/95 rounded-2xl p-4 border border-amber-200/70 shadow-sm flex flex-col gap-2.5">
            <span className="text-xs font-bold text-stone-800">
              Apply Module {moduleId} Effect to Chip:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  sounds.playGate();
                  setModuleGrid(PATTERN_HADAMARD);
                }}
                className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-xs font-semibold text-stone-800 transition-all active:scale-95"
              >
                Superposition
              </button>
              <button
                onClick={() => {
                  sounds.playMeasure();
                  setModuleGrid(PATTERN_MEASURED);
                }}
                className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-xs font-semibold text-stone-800 transition-all active:scale-95"
              >
                Measure All
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setModuleGrid(INITIAL_QUBIT_GRID);
                }}
                className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 transition-all active:scale-95"
              >
                Reset Grid
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= LESSON CONTENT ================= */
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          {/* Module 1 */}
          {moduleId === 1 && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_20px_rgba(245,135,32,0.05)] flex flex-col gap-3">
                <h3 className="text-base font-bold text-stone-900">a bit</h3>
                <p className="text-sm text-stone-600">a switch: always zero or one.</p>
                <div className="flex items-center gap-8 pt-1">
                  <div
                    onClick={() => {
                      sounds.playClick(320);
                      setBitSwitchState('zero');
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <QubitDot state="zero" size="lg" isSelected={bitSwitchState === 'zero'} />
                    <span className="text-xs font-semibold text-stone-600">zero</span>
                  </div>
                  <div
                    onClick={() => {
                      sounds.playClick(580);
                      setBitSwitchState('one');
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <QubitDot state="one" size="lg" isSelected={bitSwitchState === 'one'} />
                    <span className="text-xs font-semibold text-stone-600">one</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_20px_rgba(245,135,32,0.05)] flex flex-col gap-3">
                <h3 className="text-base font-bold text-stone-900">a qubit</h3>
                <p className="text-sm text-stone-600">
                  can be zero, one, or a blend of both until you look.
                </p>
                <div className="flex items-center gap-8 pt-1">
                  <div className="flex flex-col items-center gap-2">
                    <QubitDot state="blend" size="lg" />
                    <span className="text-xs font-semibold text-stone-600">blend</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Module 2 */}
          {moduleId === 2 && (
            <div className="flex flex-col gap-3.5">
              <div
                className={`bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-4 sm:p-5 border transition-all shadow-sm flex flex-col gap-2 ${
                  pipelineStep === 1 ? 'border-orange-500 ring-2 ring-orange-200' : 'border-amber-200/80'
                }`}
              >
                <h3 className="text-base font-bold text-stone-900">1. prepare</h3>
                <p className="text-sm text-stone-600">every qubit starts dark, in the zero state.</p>
                <div className="flex items-center gap-8 pt-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">start</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">start</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">start</span>
                  </div>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-4 sm:p-5 border transition-all shadow-sm flex flex-col gap-2 ${
                  pipelineStep === 2 ? 'border-orange-500 ring-2 ring-orange-200' : 'border-amber-200/80'
                }`}
              >
                <h3 className="text-base font-bold text-stone-900">2. apply gates</h3>
                <p className="text-sm text-stone-600">gates change each qubit.</p>
                <div className="flex items-center gap-8 pt-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="one" size="md" />
                    <span className="text-[11px] text-stone-500">flipped</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="blend" size="md" />
                    <span className="text-[11px] text-stone-500">blend</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">same</span>
                  </div>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-4 sm:p-5 border transition-all shadow-sm flex flex-col gap-2 ${
                  pipelineStep === 3 ? 'border-orange-500 ring-2 ring-orange-200' : 'border-amber-200/80'
                }`}
              >
                <h3 className="text-base font-bold text-stone-900">3. measure</h3>
                <p className="text-sm text-stone-600">blends snap to lit or dark.</p>
                <div className="flex items-center gap-8 pt-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="one" size="md" />
                    <span className="text-[11px] text-stone-500">result</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">result</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">result</span>
                  </div>
                </div>
              </div>

              <button
                onClick={runPipelineAnimation}
                className="w-full py-3 bg-gradient-to-r from-orange-100/80 via-amber-100 to-orange-100 border border-orange-300 rounded-2xl text-xs font-bold text-orange-950 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current text-orange-600" />
                <span>Simulate 3-Step Quantum Cycle</span>
              </button>
            </div>
          )}

          {/* Module 3 */}
          {moduleId === 3 && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-col items-center">
                <div className="w-full text-left mb-2">
                  <h3 className="text-base font-bold text-stone-900">the qubit sphere</h3>
                  <p className="text-sm text-stone-600">
                    top is zero, bottom is one, in between is a blend.
                  </p>
                </div>
                <BlochSphere />
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-sm">
                <h3 className="text-base font-bold text-stone-900">what the lights show</h3>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  brighter means more likely to read one. Drag the vector arrow above to rotate between ground |0⟩, excited |1⟩, and equatorial superpositions!
                </p>
              </div>
            </div>
          )}

          {/* Module 4 */}
          {moduleId === 4 && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-3">
                <h3 className="text-base font-bold text-stone-900">alpha and beta</h3>
                <p className="text-sm text-stone-600">
                  alpha is how much zero. beta is how much one. think of a dimmer, not a switch.
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span className="text-stone-600">α (zero): {alphaVal}%</span>
                    <span className="text-orange-600">β (one): {betaVal}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={alphaVal}
                    onChange={(e) => {
                      setAlphaVal(Number(e.target.value));
                      sounds.playClick(400 + alphaVal * 3, 0.015);
                    }}
                    className="w-full accent-[#F58720] cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm">
                <h3 className="text-base font-bold text-stone-900">odds</h3>
                <p className="text-sm text-stone-600 mt-1">
                  the odds of each answer come from those two numbers, and they always add up to 100%.
                </p>
                <div className="mt-3 flex items-center justify-between p-3 bg-amber-50/70 rounded-2xl border border-amber-100 text-xs font-mono">
                  <span className="text-stone-700 font-medium">|α|² + |β|² = 100%</span>
                  <span className="font-bold text-orange-700">{alphaVal}% + {betaVal}% = 100%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col items-center">
                <div className="w-full text-left">
                  <h3 className="text-base font-bold text-stone-900">example</h3>
                  <p className="text-sm text-stone-600 mt-1">
                    an even mix gives 50% and 50%: the half-lit dot.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 mt-3">
                  <QubitDot state="blend" size="lg" />
                  <span className="text-xs font-bold text-stone-800 font-mono">50 / 50</span>
                </div>
              </div>
            </div>
          )}

          {/* Module 5 */}
          {moduleId === 5 && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">dot, symbol, vector</h3>
                  <p className="text-sm text-stone-600 mt-0.5">
                    each light matches a symbol and a pair of numbers.
                  </p>
                </div>

                <div className="w-full pt-1">
                  <div className="grid grid-cols-3 text-xs font-bold text-stone-500 pb-2 border-b border-stone-100">
                    <span>light</span>
                    <span>dirac</span>
                    <span className="text-right">vector</span>
                  </div>

                  <div className="grid grid-cols-3 items-center py-2.5 border-b border-amber-50">
                    <div>
                      <QubitDot state="zero" size="sm" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-stone-800">|0⟩</span>
                    <span className="font-mono text-xs text-stone-600 text-right">[1, 0]</span>
                  </div>

                  <div className="grid grid-cols-3 items-center py-2.5 border-b border-amber-50">
                    <div>
                      <QubitDot state="one" size="sm" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-stone-800">|1⟩</span>
                    <span className="font-mono text-xs text-stone-600 text-right">[0, 1]</span>
                  </div>

                  <div className="grid grid-cols-3 items-center py-2.5">
                    <div>
                      <QubitDot state="blend" size="sm" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-stone-800">
                      (|0⟩+|1⟩)/√2
                    </span>
                    <span className="font-mono text-xs text-stone-600 text-right">
                      [0.71, 0.71]
                    </span>
                  </div>
                </div>
              </div>

              <QuizCard />
            </div>
          )}

          {/* Module 6 */}
          {moduleId === 6 && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-2">
                <h3 className="text-base font-bold text-stone-900">x gate: flip</h3>
                <p className="text-sm text-stone-600">turns zero into one.</p>
                <div className="flex items-center gap-8 pt-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">before</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="one" size="md" />
                    <span className="text-[11px] text-stone-500">after</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-2">
                <h3 className="text-base font-bold text-stone-900">h gate: blend</h3>
                <p className="text-sm text-stone-600">turns zero into an even mix.</p>
                <div className="flex items-center gap-8 pt-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="zero" size="md" />
                    <span className="text-[11px] text-stone-500">before</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <QubitDot state="blend" size="md" />
                    <span className="text-[11px] text-stone-500">after</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-2">
                <h3 className="text-base font-bold text-stone-900">z gate: phase</h3>
                <p className="text-sm text-stone-600">
                  changes a hidden detail. the light stays the same.
                </p>
              </div>

              <GatePlayground />
            </div>
          )}

          {/* Module 7 */}
          {moduleId === 7 && <MeasurementLab />}

          {/* Module 8 */}
          {moduleId === 8 && (
            <div className="flex flex-col gap-3.5">
              <EntanglementBridge />
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm">
                <h3 className="text-base font-bold text-stone-900">why it matters</h3>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  it lets qubits work together in ways bits can't. When N qubits are entangled, they can process 2ᴺ pieces of information at once!
                </p>
              </div>
            </div>
          )}

          {/* Module 9 */}
          {moduleId === 9 && <AlgorithmVisualizer />}

          {/* Module 10 */}
          {moduleId === 10 && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-stone-900">
                  <Atom className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-bold">chemistry and materials</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  simulate molecules for new medicines and batteries. Because quantum mechanics governs atomic bonds, only quantum systems can simulate complex catalysts accurately.
                </p>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-stone-900">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-bold">optimization</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  find the best route or schedule among millions. Airline flight networks, energy grid balancing, and financial portfolio optimization.
                </p>
              </div>

              <div className="bg-gradient-to-br from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-sm flex flex-col gap-2">
                <h3 className="text-base font-bold text-stone-900">honest note</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  today's machines are small and noisy. most uses are still ahead. Error-correction and fault tolerance are active frontiers in quantum physics today.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10-Dash Progress Bar at bottom */}
      <div className="w-full flex items-center justify-between gap-1.5 pt-2">
        {Array.from({ length: 10 }).map((_, idx) => {
          const stepNum = idx + 1;
          const isFilled = stepNum <= moduleId;
          return (
            <div
              key={idx}
              onClick={() => onSelectModule(stepNum)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 hover:h-2.5 ${
                isFilled ? 'bg-[#F58720]' : 'bg-[#E5E3DF]'
              }`}
              title={`Jump to Module ${stepNum}`}
            />
          );
        })}
      </div>

      {/* Navigation Buttons: Previous & Next */}
      <div className="flex items-center gap-2.5 pt-1">
        {moduleId > 1 && (
          <button
            onClick={handlePrevClick}
            className="py-4 px-4 bg-white/95 hover:bg-stone-100 active:scale-95 text-stone-700 font-bold rounded-[22px] border border-amber-200/80 shadow-sm flex items-center justify-center transition-all"
            title="Previous module"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleNextClick}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-[#F58720] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] active:scale-[0.99] text-white font-bold text-base rounded-[24px] shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <span>{nextTitles[moduleId] || 'next'}</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
