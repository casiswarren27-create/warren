import { ChemicalReaction } from '../types';

export const PRESET_REACTIONS: ChemicalReaction[] = [
  {
    id: 'rxn-water-synth',
    title: 'Water Synthesis',
    category: 'Synthesis',
    difficulty: 'Beginner',
    reactants: [
      { formula: 'H2', name: 'Hydrogen Gas', atoms: { H: 2 }, color: '#E2E8F0', structure: 'diatomic' },
      { formula: 'O2', name: 'Oxygen Gas', atoms: { O: 2 }, color: '#EF4444', structure: 'diatomic' },
    ],
    products: [
      { formula: 'H2O', name: 'Water', atoms: { H: 2, O: 1 }, color: '#38BDF8', structure: 'bent' },
    ],
    solutionCoefficients: {
      reactants: [2, 1],
      products: [2],
    },
    activationEnergyEa: 45,
    deltaH: -285.8, // Exothermic
    description: 'Hydrogen reacts explosively with oxygen to produce liquid water. Essential benchmark for mass conservation.',
    curriculumBenchmark: 'HS-PS1-7: Use mathematical representations to support conservation of mass',
  },
  {
    id: 'rxn-ammonia-haber',
    title: 'Ammonia Synthesis (Haber Process)',
    category: 'Synthesis',
    difficulty: 'Beginner',
    reactants: [
      { formula: 'N2', name: 'Nitrogen Gas', atoms: { N: 2 }, color: '#3B82F6', structure: 'diatomic' },
      { formula: 'H2', name: 'Hydrogen Gas', atoms: { H: 2 }, color: '#E2E8F0', structure: 'diatomic' },
    ],
    products: [
      { formula: 'NH3', name: 'Ammonia', atoms: { N: 1, H: 3 }, color: '#6366F1', structure: 'trigonal' },
    ],
    solutionCoefficients: {
      reactants: [1, 3],
      products: [2],
    },
    activationEnergyEa: 85,
    deltaH: -92.2,
    description: 'Industrial production of ammonia fertilizer feeding global agriculture.',
    curriculumBenchmark: 'HS-PS1-5: Apply scientific principles to provide explanations of reaction rates',
  },
  {
    id: 'rxn-methane-combustion',
    title: 'Methane Combustion',
    category: 'Combustion',
    difficulty: 'Intermediate',
    reactants: [
      { formula: 'CH4', name: 'Methane (Natural Gas)', atoms: { C: 1, H: 4 }, color: '#334155', structure: 'tetrahedral' },
      { formula: 'O2', name: 'Oxygen Gas', atoms: { O: 2 }, color: '#EF4444', structure: 'diatomic' },
    ],
    products: [
      { formula: 'CO2', name: 'Carbon Dioxide', atoms: { C: 1, O: 2 }, color: '#64748B', structure: 'linear' },
      { formula: 'H2O', name: 'Water Vapor', atoms: { H: 2, O: 1 }, color: '#38BDF8', structure: 'bent' },
    ],
    solutionCoefficients: {
      reactants: [1, 2],
      products: [1, 2],
    },
    activationEnergyEa: 65,
    deltaH: -890.3,
    description: 'Complete combustion of natural gas yielding carbon dioxide and water vapor.',
    curriculumBenchmark: 'HS-PS1-2: Construct and revise explanations for the outcome of simple chemical reactions',
  },
  {
    id: 'rxn-photosynthesis',
    title: 'Photosynthesis (Biochemical)',
    category: 'Biochemistry',
    difficulty: 'Advanced',
    reactants: [
      { formula: 'CO2', name: 'Carbon Dioxide', atoms: { C: 1, O: 2 }, color: '#64748B', structure: 'linear' },
      { formula: 'H2O', name: 'Water', atoms: { H: 2, O: 1 }, color: '#38BDF8', structure: 'bent' },
    ],
    products: [
      { formula: 'C6H12O6', name: 'Glucose', atoms: { C: 6, H: 12, O: 6 }, color: '#22C55E', structure: 'tetrahedral' },
      { formula: 'O2', name: 'Oxygen Gas', atoms: { O: 2 }, color: '#EF4444', structure: 'diatomic' },
    ],
    solutionCoefficients: {
      reactants: [6, 6],
      products: [1, 6],
    },
    activationEnergyEa: 120,
    deltaH: 2800, // Endothermic (requires solar photon energy)
    description: 'Plants harness light energy to turn carbon dioxide and water into oxygen and high-energy glucose.',
    curriculumBenchmark: 'HS-LS1-5: Use a model to illustrate how photosynthesis transforms light energy into chemical energy',
  },
  {
    id: 'rxn-rust-iron-oxide',
    title: 'Iron Oxidation (Rust Formation)',
    category: 'Synthesis',
    difficulty: 'Intermediate',
    reactants: [
      { formula: 'Fe', name: 'Iron Metal', atoms: { Fe: 1 }, color: '#D97706', structure: 'single' },
      { formula: 'O2', name: 'Oxygen Gas', atoms: { O: 2 }, color: '#EF4444', structure: 'diatomic' },
    ],
    products: [
      { formula: 'Fe2O3', name: 'Iron(III) Oxide (Rust)', atoms: { Fe: 2, O: 3 }, color: '#B45309', structure: 'trigonal' },
    ],
    solutionCoefficients: {
      reactants: [4, 3],
      products: [2],
    },
    activationEnergyEa: 75,
    deltaH: -824.2,
    description: 'Metallic iron slowly oxidizes in atmospheric oxygen forming characteristic reddish-brown rust.',
    curriculumBenchmark: 'HS-PS1-4: Develop a model to illustrate that energy release/absorption depends on total bond energies',
  },
  {
    id: 'rxn-acid-base-neutralization',
    title: 'Hydrochloric Acid & Sodium Hydroxide',
    category: 'Acid-Base',
    difficulty: 'Intermediate',
    reactants: [
      { formula: 'HCl', name: 'Hydrochloric Acid', atoms: { H: 1, Cl: 1 }, color: '#10B981', structure: 'diatomic' },
      { formula: 'NaOH', name: 'Sodium Hydroxide', atoms: { Na: 1, O: 1, H: 1 }, color: '#A855F7', structure: 'trigonal' },
    ],
    products: [
      { formula: 'NaCl', name: 'Sodium Chloride (Table Salt)', atoms: { Na: 1, Cl: 1 }, color: '#94A3B8', structure: 'diatomic' },
      { formula: 'H2O', name: 'Water', atoms: { H: 2, O: 1 }, color: '#38BDF8', structure: 'bent' },
    ],
    solutionCoefficients: {
      reactants: [1, 1],
      products: [1, 1],
    },
    activationEnergyEa: 30,
    deltaH: -57.1,
    description: 'Classic strong acid and strong base neutralization yielding salt water.',
    curriculumBenchmark: 'MS-PS1-2: Analyze and interpret data on properties of substances before and after interaction',
  },
  {
    id: 'rxn-thermite-ap',
    title: 'Thermite Reaction (AP Chem)',
    category: 'Single Replacement',
    difficulty: 'AP Chem',
    reactants: [
      { formula: 'Al', name: 'Aluminum Metal', atoms: { Al: 1 }, color: '#94A3B8', structure: 'single' },
      { formula: 'Fe2O3', name: 'Iron(III) Oxide', atoms: { Fe: 2, O: 3 }, color: '#B45309', structure: 'trigonal' },
    ],
    products: [
      { formula: 'Al2O3', name: 'Aluminum Oxide', atoms: { Al: 2, O: 3 }, color: '#E2E8F0', structure: 'trigonal' },
      { formula: 'Fe', name: 'Molten Iron Metal', atoms: { Fe: 1 }, color: '#F59E0B', structure: 'single' },
    ],
    solutionCoefficients: {
      reactants: [2, 1],
      products: [1, 2],
    },
    activationEnergyEa: 150,
    deltaH: -851.5,
    description: 'Extremely exothermic redox reaction producing liquid iron, used in underwater welding and railway repairs.',
    curriculumBenchmark: 'AP-CHEM-4.7: Types of Chemical Reactions & Oxidation-Reduction',
  }
];
