import React, { useState, useEffect } from 'react';
import { ScreenType, QubitState } from './types/quantum';
import { sounds } from './utils/audio';
import { QubiAvatar } from './components/QubiAvatar';
import { QubiBubble } from './components/QubiBubble';
import { QubitGrid, INITIAL_QUBIT_GRID, PATTERN_HADAMARD, PATTERN_MEASURED } from './components/QubitGrid';
import { ChandelierAR } from './components/ChandelierAR';
import { IntroModal } from './components/IntroModal';
import { ModuleScreen } from './components/ModuleScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { MODULE_LIST } from './components/ModulesMenu';
import {
  Volume2,
  VolumeX,
  Menu,
  Compass,
  Cpu,
  BookOpen,
  Sparkles,
  X,
  Check,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [selectedQubit, setSelectedQubit] = useState<number>(13); // Qubit 14 (0-indexed 13) matching PDF page 4
  const [currentModuleId, setCurrentModuleId] = useState<number>(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [unlockedMax, setUnlockedMax] = useState<number>(1);

  // Audio and layout preferences
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Chip grid state
  const [gridState, setGridState] = useState<QubitState[]>(INITIAL_QUBIT_GRID);
  const [activePatternIndex, setActivePatternIndex] = useState<number>(0);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('quantum_completed_modules');
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) {
          setCompletedModules(parsed);
          setUnlockedMax(Math.max(1, ...parsed.map((n: number) => n + 1)));
        }
      }
    } catch {}
  }, []);

  const saveCompletion = (modId: number) => {
    setCompletedModules((prev) => {
      const next = prev.includes(modId) ? prev : [...prev, modId];
      try {
        localStorage.setItem('quantum_completed_modules', JSON.stringify(next));
      } catch {}
      return next;
    });
    setUnlockedMax((prev) => Math.max(prev, modId + 1));
  };

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playClick();
  };

  const handleSelectQubit = (index: number) => {
    setSelectedQubit(index);
    setScreen('qubit-detail');
  };

  const handleSelectPattern = (idx: number) => {
    sounds.playGate();
    setActivePatternIndex(idx);
    if (idx === 0) setGridState(INITIAL_QUBIT_GRID);
    else if (idx === 1) setGridState(PATTERN_HADAMARD);
    else setGridState(PATTERN_MEASURED);
  };

  const handleNextModule = () => {
    saveCompletion(currentModuleId);
    if (currentModuleId >= 10) {
      setScreen('completed');
    } else {
      setCurrentModuleId((prev) => prev + 1);
    }
  };

  const handlePrevModule = () => {
    if (currentModuleId > 1) {
      setCurrentModuleId((prev) => prev - 1);
    }
  };

  const jumpToModule = (id: number) => {
    sounds.playClick();
    setCurrentModuleId(id);
    setScreen('module-detail');
    setIsNavDrawerOpen(false);
  };

  // Determine current selected qubit details
  const selectedState = gridState[selectedQubit] || 'blend';

  return (
    <div className="min-h-[100dvh] w-full bg-[#121110] flex items-center justify-center p-0 sm:py-4 sm:px-3 text-stone-900 font-sans select-none overflow-x-hidden">
      {/* Ambient warm radial glow behind the centered 6.7" app container */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(245,135,32,0.13)_0%,rgba(180,83,9,0.05)_45%,transparent_75%)]" />

      {/* Centered 6.7-inch Mobile Viewport Container (430px × 932px standard CSS dimensions) */}
      <main className="relative w-full max-w-[430px] h-[100dvh] sm:h-[932px] sm:max-h-[calc(100vh-2rem)] sm:rounded-[38px] overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F1] to-[#FED7AA]/35 shadow-[0_25px_70px_rgba(0,0,0,0.65),0_0_50px_rgba(245,135,32,0.12)] sm:border sm:border-amber-500/20 flex flex-col">
        
        {/* TOP HEADER BAR with Top-Left Menu Button & Stage Switcher */}
        <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-amber-200/60 shadow-sm">
          {/* Top-Left Menu Button (requested by user) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                setIsNavDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/95 hover:bg-orange-50 border border-amber-200/80 text-stone-800 font-bold text-xs shadow-sm active:scale-95 transition-all"
              title="Open Modules & Navigation"
            >
              <Menu className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              <span>Modules</span>
              {screen === 'module-detail' && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {currentModuleId}
                </span>
              )}
            </button>
          </div>

          {/* Center Stage Quick-Switcher Pills (Integrated flow: AR · Chip · Modules) */}
          <div className="flex items-center bg-amber-100/70 p-0.5 rounded-full border border-amber-200/60 text-[11px] font-semibold text-stone-600">
            <button
              onClick={() => {
                sounds.playClick();
                setScreen('ar-scan');
              }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                screen === 'ar-scan'
                  ? 'bg-white text-orange-950 shadow-sm font-bold'
                  : 'hover:text-stone-900'
              }`}
            >
              AR
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setScreen('chip-grid');
              }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                screen === 'chip-grid' || screen === 'qubit-detail'
                  ? 'bg-white text-orange-950 shadow-sm font-bold'
                  : 'hover:text-stone-900'
              }`}
            >
              Chip
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setScreen('module-detail');
              }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                screen === 'module-detail'
                  ? 'bg-white text-orange-950 shadow-sm font-bold'
                  : 'hover:text-stone-900'
              }`}
            >
              Learn
            </button>
          </div>

          {/* Top-Right Sound Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-orange-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>
          </div>
        </header>

        {/* SLIDE-IN MODULES & QUICK ACCESS DRAWER (Accessed via top-left menu) */}
        {isNavDrawerOpen && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in flex flex-col justify-end">
            <div className="bg-[#FAF8F5] rounded-t-[36px] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-t border-amber-200 animate-in slide-in-from-bottom duration-200">
              {/* Drawer Header */}
              <div className="p-5 pb-3 border-b border-amber-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span className="text-base font-bold text-stone-900">
                    Explore & Learn
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full font-semibold">
                    {completedModules.length}/10 Done
                  </span>
                </div>
                <button
                  onClick={() => setIsNavDrawerOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hardware Quick Jump Tabs */}
              <div className="p-4 grid grid-cols-3 gap-2 border-b border-amber-100 bg-amber-50/40 text-xs font-semibold">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setScreen('welcome');
                    setIsNavDrawerOpen(false);
                  }}
                  className="p-2.5 bg-white rounded-2xl border border-amber-200/70 text-stone-800 flex flex-col items-center gap-1 shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Welcome</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setScreen('ar-scan');
                    setIsNavDrawerOpen(false);
                  }}
                  className="p-2.5 bg-white rounded-2xl border border-amber-200/70 text-stone-800 flex flex-col items-center gap-1 shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
                >
                  <Compass className="w-4 h-4 text-orange-500" />
                  <span>AR Chandelier</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setScreen('chip-grid');
                    setIsNavDrawerOpen(false);
                  }}
                  className="p-2.5 bg-white rounded-2xl border border-amber-200/70 text-stone-800 flex flex-col items-center gap-1 shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
                >
                  <Cpu className="w-4 h-4 text-orange-500" />
                  <span>5x5 Chip</span>
                </button>
              </div>

              {/* 10 Modules List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1">
                  10 Learning Modules
                </span>
                {MODULE_LIST.map((item) => {
                  const isCompleted = completedModules.includes(item.id);
                  const isCurrent = screen === 'module-detail' && currentModuleId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => jumpToModule(item.id)}
                      className={`w-full py-3 px-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                        isCurrent
                          ? 'bg-orange-50 border-orange-400 shadow-sm ring-1 ring-orange-300'
                          : isCompleted
                          ? 'bg-white border-amber-200 hover:bg-amber-50/50'
                          : 'bg-white border-stone-200/80 hover:bg-orange-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-orange-500 text-white'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.id}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isCurrent ? 'text-orange-950 font-bold' : 'text-stone-800'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-stone-400">
                        {isCompleted && (
                          <span className="text-emerald-600 font-semibold text-[11px]">done</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-amber-200/60 bg-white flex items-center justify-between text-xs text-stone-500">
                <span>Quantum AR Explorer</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    localStorage.removeItem('quantum_completed_modules');
                    setCompletedModules([]);
                    setUnlockedMax(1);
                    setIsNavDrawerOpen(false);
                  }}
                  className="flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Progress</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 no-scrollbar flex flex-col justify-between">
          
          {/* ================= SCREEN 1: WELCOME (Page 1) ================= */}
          {screen === 'welcome' && (
            <div className="flex flex-col gap-4 flex-1 justify-between pb-2 animate-in fade-in duration-200">
              <div className="flex flex-col gap-3.5">
                {/* Intro / Skip bar */}
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>intro • 0:30</span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setScreen('module-detail');
                    }}
                    className="hover:text-stone-900 text-stone-600 font-semibold transition-colors"
                  >
                    skip to modules
                  </button>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                  meet your first <br />
                  quantum computer
                </h1>

                {/* Central Visual Card with Qubi & Watch Intro */}
                <div className="relative w-full aspect-[4/4.4] rounded-[36px] overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FFEED6] to-[#FED7AA] border border-orange-200/70 shadow-[0_8px_32px_rgba(245,135,32,0.12)] flex flex-col items-center justify-between p-6">
                  {/* Concentric Golden Stage Rings in Ambient Background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] h-[290px] rounded-full border border-orange-300/40 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[210px] rounded-full border border-orange-300/60 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full border border-orange-400/80 pointer-events-none" />

                  {/* Top space filler */}
                  <div />

                  {/* Centered Qubi Mascot with dynamic eye movement */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <QubiAvatar size="hero" mood="curious" />
                  </div>

                  {/* Watch Intro Pill Button */}
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsIntroModalOpen(true);
                    }}
                    className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-white via-white to-amber-50 hover:bg-white text-stone-900 font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 border border-amber-200/60"
                  >
                    watch intro
                  </button>
                </div>

                {/* Qubi Speech Bubble */}
                <QubiBubble message="hey, look at this. this is a quantum computer. interact with it." />
              </div>

              {/* Bottom Action Button */}
              <button
                onClick={() => {
                  sounds.playGate();
                  setScreen('ar-scan');
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#F58720] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] active:scale-[0.99] text-white font-bold text-base rounded-[24px] shadow-md flex items-center justify-center transition-all mt-2"
              >
                launch ar experience
              </button>
            </div>
          )}

          {/* ================= SCREEN 2: AR CHANDELIER (Page 2) ================= */}
          {screen === 'ar-scan' && (
            <div className="flex flex-col gap-3 flex-1 justify-between pb-2 animate-in fade-in duration-200">
              <div className="flex flex-col gap-0.5">
                <span className="text-stone-500 text-xs font-normal">
                  ar • surface found
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  tap the processor
                </h1>
              </div>

              {/* Interactive Chandelier AR View */}
              <div className="flex-1 min-h-[400px] rounded-[32px] overflow-hidden border border-amber-200/80 shadow-sm relative">
                <ChandelierAR
                  onTapProcessor={() => {
                    setScreen('chip-grid');
                  }}
                />
              </div>

              {/* Qubi Dialogue Bubble */}
              <QubiBubble message="tap the processor to zoom in." />
            </div>
          )}

          {/* ================= SCREEN 3: INSIDE THE CHIP (Page 3) ================= */}
          {screen === 'chip-grid' && (
            <div className="flex flex-col gap-3.5 flex-1 justify-between pb-2 animate-in fade-in duration-200">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs font-medium">
                    zoom 4× • processor
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setScreen('ar-scan');
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    zoom out
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  inside the chip
                </h1>
              </div>

              {/* Qubi Speech Bubble */}
              <QubiBubble message="each dot is a qubit. tap one to look closer." />

              {/* 5x5 Qubit Grid on white card */}
              <div className="my-auto py-1">
                <QubitGrid
                  grid={gridState}
                  selectedQubitIndex={null}
                  onSelectQubit={handleSelectQubit}
                  showLegend={true}
                  size="md"
                />
              </div>

              {/* Bottom Quick Jump button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setScreen('module-detail');
                }}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-white via-white to-amber-50 hover:bg-stone-50 text-stone-900 font-bold text-sm rounded-[24px] border border-amber-200 shadow-sm transition-all"
              >
                start learning modules
              </button>
            </div>
          )}

          {/* ================= SCREEN 4: QUBIT SELECTED (Page 4) ================= */}
          {screen === 'qubit-detail' && (
            <div className="flex flex-col gap-3.5 flex-1 justify-between pb-2 animate-in fade-in duration-200">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs font-medium">
                    qubit {selectedQubit + 1} • selected
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setScreen('chip-grid');
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    back to grid
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  lights on, lights off
                </h1>
              </div>

              {/* 5x5 Qubit Grid with Selected Qubit Ring */}
              <QubitGrid
                grid={gridState}
                selectedQubitIndex={selectedQubit}
                onSelectQubit={handleSelectQubit}
                showLegend={false}
                size="compact"
              />

              {/* Detail Card matching PDF page 4 */}
              <div className="bg-gradient-to-br from-white via-white to-amber-50/50 rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-[0_4px_20px_rgba(245,135,32,0.06)] flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-500">
                  <span>state: {selectedState}</span>
                  <span className="font-mono">
                    {selectedState === 'blend'
                      ? '50% / 50%'
                      : selectedState === 'one'
                      ? '0% / 100%'
                      : '100% / 0%'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {selectedState === 'blend'
                    ? 'mix of zero and one'
                    : selectedState === 'one'
                    ? 'excited ground state'
                    : 'dark ground state'}
                </h3>

                {/* Segmented Distribution Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-200">
                  <div
                    className="bg-[#F58720] h-full transition-all duration-300"
                    style={{
                      width:
                        selectedState === 'blend'
                          ? '50%'
                          : selectedState === 'one'
                          ? '100%'
                          : '0%',
                    }}
                  />
                  <div
                    className="bg-[#F6D59C] h-full transition-all duration-300"
                    style={{
                      width:
                        selectedState === 'blend'
                          ? '50%'
                          : selectedState === 'zero'
                          ? '100%'
                          : '0%',
                    }}
                  />
                </div>

                {/* 3 Miniature Shifting Patterns preview */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSelectPattern(0)}
                      className={`p-1 rounded-xl border transition-all ${
                        activePatternIndex === 0
                          ? 'border-orange-500 ring-2 ring-orange-200'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                      title="Pattern 1: Initial Superposition"
                    >
                      <QubitGrid
                        grid={INITIAL_QUBIT_GRID}
                        size="sm"
                        showLegend={false}
                        interactive={false}
                      />
                    </button>
                    <button
                      onClick={() => handleSelectPattern(1)}
                      className={`p-1 rounded-xl border transition-all ${
                        activePatternIndex === 1
                          ? 'border-orange-500 ring-2 ring-orange-200'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                      title="Pattern 2: Hadamard Gate Run"
                    >
                      <QubitGrid
                        grid={PATTERN_HADAMARD}
                        size="sm"
                        showLegend={false}
                        interactive={false}
                      />
                    </button>
                    <button
                      onClick={() => handleSelectPattern(2)}
                      className={`p-1 rounded-xl border transition-all ${
                        activePatternIndex === 2
                          ? 'border-orange-500 ring-2 ring-orange-200'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                      title="Pattern 3: Measurement Snapshot"
                    >
                      <QubitGrid
                        grid={PATTERN_MEASURED}
                        size="sm"
                        showLegend={false}
                        interactive={false}
                      />
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 leading-tight">
                    patterns shift <br />
                    as gates run
                  </span>
                </div>
              </div>

              {/* Bottom Action Button: start module 1 */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentModuleId(1);
                  setScreen('module-detail');
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#F58720] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] active:scale-[0.99] text-white font-bold text-base rounded-[24px] shadow-md flex items-center justify-center transition-all mt-1"
              >
                start module 1
              </button>
            </div>
          )}

          {/* ================= SCREEN 5: MODULE RUNNER (Integrated with 5x5 Chip & Lessons) ================= */}
          {screen === 'module-detail' && (
            <ModuleScreen
              moduleId={currentModuleId}
              onNext={handleNextModule}
              onPrev={handlePrevModule}
              onSelectModule={(id) => setCurrentModuleId(id)}
              onViewAR={() => setScreen('ar-scan')}
            />
          )}

          {/* ================= SCREEN 6: COMPLETION CELEBRATION ================= */}
          {screen === 'completed' && (
            <CompletionScreen
              onRestart={() => {
                localStorage.removeItem('quantum_completed_modules');
                setCompletedModules([]);
                setUnlockedMax(1);
                setCurrentModuleId(1);
                setScreen('welcome');
              }}
              onGoToAR={() => setScreen('ar-scan')}
              onGoToChip={() => setScreen('chip-grid')}
              onGoToModules={() => {
                setCurrentModuleId(1);
                setScreen('module-detail');
              }}
            />
          )}
        </div>

        {/* 30-Second Intro Tour Modal */}
        <IntroModal
          isOpen={isIntroModalOpen}
          onClose={() => setIsIntroModalOpen(false)}
          onFinishIntro={() => {
            setIsIntroModalOpen(false);
            setScreen('ar-scan');
          }}
        />
      </main>
    </div>
  );
}
