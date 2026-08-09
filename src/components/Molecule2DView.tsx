import React from 'react';
import { Molecule, ElementSymbol } from '../types';
import { ELEMENTS_DATA } from '../data/elements';

interface Props {
  molecule: Molecule;
  coefficient: number;
  onCoefficientChange: (newVal: number) => void;
  isReactant?: boolean;
}

export const Molecule2DView: React.FC<Props> = ({
  molecule,
  coefficient,
  onCoefficientChange,
  isReactant = true,
}) => {
  // Generate atom graphics preview for 1 instance of molecule
  const renderSingleMoleculeShape = () => {
    const atomEntries = Object.entries(molecule.atoms);
    
    return (
      <div className="relative w-20 h-20 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-center p-1 shadow-inner group hover:border-slate-600 transition">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {atomEntries.map(([symbol, count]) => {
            const elem = ELEMENTS_DATA[symbol as ElementSymbol] || {
              color: '#38BDF8',
              symbol: symbol as ElementSymbol,
            };

            return Array.from({ length: Math.min(Number(count), 12) }).map((_, i) => (
              <div
                key={`${symbol}-${i}`}
                className="w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[9px] text-slate-900 shadow-md ring-1 ring-white/20 transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: elem.color }}
                title={`${elem.symbol} Atom`}
              >
                {symbol}
              </div>
            ));
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-all duration-300 min-w-[200px]">
      {/* Molecule Name Badge */}
      <div className="text-center mb-3">
        <h4 className="font-bold text-slate-100 text-sm">{molecule.name}</h4>
        <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
          {molecule.formula}
        </span>
      </div>

      {/* Coefficient Controller */}
      <div className="flex items-center gap-2 mb-4 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
        <button
          id={`decrement-${molecule.formula}`}
          onClick={() => onCoefficientChange(Math.max(0, coefficient - 1))}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-lg flex items-center justify-center active:scale-95 transition disabled:opacity-40"
          disabled={coefficient <= 0}
        >
          -
        </button>

        <div className="flex flex-col items-center px-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Coeff</span>
          <span className="text-xl font-mono font-black text-amber-400">{coefficient}</span>
        </div>

        <button
          id={`increment-${molecule.formula}`}
          onClick={() => onCoefficientChange(coefficient + 1)}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-lg flex items-center justify-center active:scale-95 transition"
        >
          +
        </button>
      </div>

      {/* Visual Stack of Molecules (PhET Style) */}
      <div className="w-full">
        <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex justify-between items-center px-1">
          <span>Active Molecules:</span>
          <span className="font-mono text-cyan-300 font-bold">{coefficient}x</span>
        </div>

        {coefficient === 0 ? (
          <div className="h-20 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500 italic">
            Zero molecules selected
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center max-h-44 overflow-y-auto p-2 bg-slate-950/50 rounded-xl border border-slate-800/80 custom-scrollbar">
            {Array.from({ length: Math.min(coefficient, 10) }).map((_, idx) => (
              <div key={idx} className="transition-all duration-300 scale-90">
                {renderSingleMoleculeShape()}
              </div>
            ))}
            {coefficient > 10 && (
              <div className="w-full text-center text-xs text-amber-400/90 font-medium pt-1">
                +{coefficient - 10} more molecules in box
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
