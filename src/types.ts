// ChemBalance Pro - Core Type Definitions

export type ElementSymbol = 'H' | 'O' | 'C' | 'N' | 'Fe' | 'Cl' | 'Na' | 'S' | 'Ca' | 'Cu' | 'Mg' | 'Al' | 'K' | 'Pb' | 'Ag';

export interface ElementData {
  symbol: ElementSymbol;
  name: string;
  color: string;
  radius: number; // For canvas molecular representation
  atomicMass: number;
}

export interface MoleculeAtomCount {
  [element: string]: number;
}

export interface Molecule {
  formula: string;
  name: string;
  atoms: MoleculeAtomCount;
  color?: string;
  structure?: 'linear' | 'bent' | 'tetrahedral' | 'trigonal' | 'diatomic' | 'single';
}

export interface ChemicalReaction {
  id: string;
  title: string;
  category: 'Synthesis' | 'Decomposition' | 'Combustion' | 'Single Replacement' | 'Double Replacement' | 'Acid-Base' | 'Biochemistry';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'AP Chem';
  reactants: Molecule[];
  products: Molecule[];
  solutionCoefficients: {
    reactants: number[];
    products: number[];
  };
  activationEnergyEa: number; // in kJ/mol for Kinetic simulation
  deltaH: number; // enthalpy change (- for exothermic, + for endothermic)
  description: string;
  curriculumBenchmark: string; // e.g. "HS-PS1-7: Conservation of Matter"
}

export interface ReactionState {
  reactantCoefficients: number[];
  productCoefficients: number[];
  isBalanced: boolean;
}

// Particle Physics Simulation Types
export interface KineticParticle {
  id: string;
  moleculeIndex: number;
  isProduct: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: string; // Formula string
  color: string;
  mass: number;
  rotAngle: number;
  rotSpeed: number;
}

export interface KineticSimSettings {
  temperatureK: number; // 100K - 1000K
  activationEnergyThreshold: number; // 10 - 200 kJ/mol
  totalReactantParticles: number;
  reactionEnthalpy: number; // Delta H
  isRunning: boolean;
  timeSpeed: number;
}

// Student & Teacher Progress Types
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  equationsSolved: number;
  accuracyRate: number; // percentage
  avgTimePerEquationSec: number;
  xpPoints: number;
  currentStreak: number;
  badgeLevel: 'Bronze Chemist' | 'Silver Balancer' | 'Gold Stoichiometrist' | 'Master Alchemist';
  lastActive: string;
  classGroup: string;
}

export interface PracticeAttempt {
  reactionId: string;
  reactionTitle: string;
  timeSpentSec: number;
  attemptsCount: number;
  usedHint: boolean;
  passed: boolean;
  timestamp: string;
}

export type AppView = 'balancer' | 'kinetic' | 'practice' | 'teacher' | 'leaderboard' | 'profile';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'pt';

export interface UIStrings {
  appName: string;
  balancerTab: string;
  kineticTab: string;
  practiceTab: string;
  teacherTab: string;
  leaderboardTab: string;
  profileTab: string;
  balanced: string;
  unbalanced: string;
  reactants: string;
  products: string;
  checkBalance: string;
  resetCoefficients: string;
  temperature: string;
  activationEnergy: string;
  kineticEnergy: string;
  reactionRate: string;
  collisionFrequency: string;
  aiTutor: string;
  askAiHint: string;
  streak: string;
  xpPoints: string;
  offlineReady: string;
  cloudSynced: string;
  teacherDashboard: string;
  studentAccuracy: string;
  exportCsvPdf: string;
  darkMode: string;
  lightMode: string;
  language: string;
  subscription: string;
  selectReaction: string;
  curriculumBenchmark: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  subscriptionTier: 'Free' | 'Student Pro' | 'Classroom License';
  language: LanguageCode;
  darkMode: boolean;
  offlineSyncEnabled: boolean;
  notificationsEnabled: boolean;
  lmsConnected: 'Canvas' | 'Google Classroom' | 'Schoology' | 'None';
  xpPoints: number;
  streakDays: number;
}
