export type QubitState = 'zero' | 'one' | 'blend';

export interface Qubit {
  id: number;
  row: number;
  col: number;
  state: QubitState;
  probZero: number; // 0 to 1
  probOne: number;  // 0 to 1
  phase?: number;   // in radians or degrees
}

export type ScreenType =
  | 'welcome'        // Page 1: meet your first quantum computer
  | 'ar-scan'        // Page 2: ar • surface found & chandelier
  | 'chip-grid'      // Page 3: inside the chip
  | 'qubit-detail'   // Page 4: qubit selected (qubit 14)
  | 'modules-menu'   // Page 5: 10 modules directory
  | 'module-detail'  // Page 6-15: Modules 1 to 10
  | 'completed';     // Celebration screen

export interface ModuleInfo {
  id: number;
  title: string;
  qubiSpeech: string;
  nextTitle?: string;
  buttonText?: string;
}
