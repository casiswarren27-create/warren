import { ElementSymbol, ElementData } from '../types';

export const ELEMENTS_DATA: Record<ElementSymbol, ElementData> = {
  H: { symbol: 'H', name: 'Hydrogen', color: '#E2E8F0', radius: 10, atomicMass: 1.008 },
  O: { symbol: 'O', name: 'Oxygen', color: '#EF4444', radius: 14, atomicMass: 15.999 },
  C: { symbol: 'C', name: 'Carbon', color: '#334155', radius: 15, atomicMass: 12.011 },
  N: { symbol: 'N', name: 'Nitrogen', color: '#3B82F6', radius: 14, atomicMass: 14.007 },
  Fe: { symbol: 'Fe', name: 'Iron', color: '#D97706', radius: 18, atomicMass: 55.845 },
  Cl: { symbol: 'Cl', name: 'Chlorine', color: '#22C55E', radius: 16, atomicMass: 35.453 },
  Na: { symbol: 'Na', name: 'Sodium', color: '#A855F7', radius: 17, atomicMass: 22.990 },
  S: { symbol: 'S', name: 'Sulfur', color: '#EAB308', radius: 16, atomicMass: 32.06 },
  Ca: { symbol: 'Ca', name: 'Calcium', color: '#10B981', radius: 18, atomicMass: 40.078 },
  Cu: { symbol: 'Cu', name: 'Copper', color: '#B45309', radius: 17, atomicMass: 63.546 },
  Mg: { symbol: 'Mg', name: 'Magnesium', color: '#14B8A6', radius: 17, atomicMass: 24.305 },
  Al: { symbol: 'Al', name: 'Aluminum', color: '#94A3B8', radius: 16, atomicMass: 26.982 },
  K: { symbol: 'K', name: 'Potassium', color: '#8B5CF6', radius: 19, atomicMass: 39.098 },
  Pb: { symbol: 'Pb', name: 'Lead', color: '#64748B', radius: 19, atomicMass: 207.2 },
  Ag: { symbol: 'Ag', name: 'Silver', color: '#CBD5E1', radius: 17, atomicMass: 107.87 },
};
