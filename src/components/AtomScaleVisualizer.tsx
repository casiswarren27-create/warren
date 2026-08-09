import React from 'react';
import { Molecule, ElementSymbol } from '../types';
import { ELEMENTS_DATA } from '../data/elements';
import { Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  reactants: Molecule[];
  products: Molecule[];
  reactantCoefficients: number[];
  productCoefficients: number[];
}

export const AtomScaleVisualizer: React.FC<Props> = ({
  reactants,
  products,
  reactantCoefficients,
  productCoefficients,
}) => {
  // Aggregate atom totals on Reactant side
  const reactantTotals: Record<string, number> = {};
  reactants.forEach((mol, idx) => {
    const coeff = Number(reactantCoefficients[idx]) || 0;
    Object.entries(mol.atoms).forEach(([elem, count]) => {
      reactantTotals[elem] = (reactantTotals[elem] || 0) + Number(count) * coeff;
    });
  });

  // Aggregate atom totals on Product side
  const productTotals: Record<string, number> = {};
  products.forEach((mol, idx) => {
    const coeff = Number(productCoefficients[idx]) || 0;
    Object.entries(mol.atoms).forEach(([elem, count]) => {
      productTotals[elem] = (productTotals[elem] || 0) + Number(count) * coeff;
    });
  });

  // Unique elements list
  const allElements = Array.from(
    new Set([...Object.keys(reactantTotals), ...Object.keys(productTotals)])
  );

  return (
    <div className="w-full bg-[#08090C] rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            Visual Atom Balance Scales & Quantitative Analysis
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">PhET-Style Conservation Check</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allElements.map((elemSymbol) => {
          const elemData = ELEMENTS_DATA[elemSymbol as ElementSymbol] || {
            name: elemSymbol,
            color: '#94A3B8',
            symbol: elemSymbol as ElementSymbol,
            atomicMass: 1,
          };
          const countL = reactantTotals[elemSymbol] || 0;
          const countR = productTotals[elemSymbol] || 0;
          const isBalanced = countL > 0 && countL === countR;
          const maxCount = Math.max(countL, countR, 12);

          // Calculate scale tilt angle (-15 deg to +15 deg)
          const diff = countR - countL;
          const tiltDeg = Math.min(Math.max(diff * 4, -18), 18);

          return (
            <div
              key={elemSymbol}
              id={`atom-scale-${elemSymbol}`}
              className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isBalanced
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-[#050608] border-slate-800'
              }`}
            >
              {/* Element Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-slate-950 shadow-inner"
                    style={{ backgroundColor: elemData.color }}
                  >
                    {elemSymbol}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{elemData.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">Mass: {elemData.atomicMass || 1} u</div>
                  </div>
                </div>

                {isBalanced ? (
                  <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Balanced</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Mismatch</span>
                  </div>
                )}
              </div>

              {/* Physical Balance Beam Visualizer */}
              <div className="relative h-16 w-full flex flex-col items-center justify-center my-2">
                {/* Scale Fulcrum Triangle */}
                <div className="absolute bottom-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-slate-700 z-0"></div>

                {/* Rotating Beam */}
                <div
                  className="w-[85%] h-1.5 bg-slate-600 rounded-full relative transition-transform duration-500 ease-out z-10 origin-center flex items-center justify-between px-1"
                  style={{ transform: `rotate(${tiltDeg}deg)` }}
                >
                  {/* Left Pan */}
                  <div className="absolute left-0 -top-6 transform -translate-x-2 flex flex-col items-center">
                    <div className="w-8 h-[2px] bg-slate-400"></div>
                    <div className="w-10 h-5 bg-slate-800 border border-sky-500/60 rounded-b-lg flex items-center justify-center text-[11px] font-mono font-bold text-sky-400 shadow">
                      {countL}
                    </div>
                  </div>

                  {/* Right Pan */}
                  <div className="absolute right-0 -top-6 transform translate-x-2 flex flex-col items-center">
                    <div className="w-8 h-[2px] bg-slate-400"></div>
                    <div className="w-10 h-5 bg-slate-800 border border-sky-500/60 rounded-b-lg flex items-center justify-center text-[11px] font-mono font-bold text-sky-400 shadow">
                      {countR}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Bar Chart Comparison */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {/* Reactant Count Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-[10px] font-mono text-slate-400">Reactants:</span>
                  <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                      style={{ width: `${Math.min((countL / maxCount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="w-5 text-right font-mono font-bold text-sky-400 text-[11px]">{countL}</span>
                </div>

                {/* Product Count Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-[10px] font-mono text-slate-400">Products:</span>
                  <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ width: `${Math.min((countR / maxCount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="w-5 text-right font-mono font-bold text-emerald-400 text-[11px]">{countR}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
