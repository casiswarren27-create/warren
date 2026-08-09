import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ChemicalReaction, UIStrings } from '../types';
import { PRESET_REACTIONS } from '../data/presetReactions';
import { Molecule2DView } from './Molecule2DView';
import { AtomScaleVisualizer } from './AtomScaleVisualizer';
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight, HelpCircle, BookOpen, Lightbulb } from 'lucide-react';

interface Props {
  t: UIStrings;
  onOpenAiTutor: (reaction: ChemicalReaction, currentReactants: number[], currentProducts: number[]) => void;
  onRecordSuccess?: (reaction: ChemicalReaction, timeSpentSec: number) => void;
}

export const EquationBalancer: React.FC<Props> = ({ t, onOpenAiTutor, onRecordSuccess }) => {
  const [selectedReaction, setSelectedReaction] = useState<ChemicalReaction>(PRESET_REACTIONS[0]);
  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>([1, 1]);
  const [productCoeffs, setProductCoeffs] = useState<number[]>([1]);
  const [isBalanced, setIsBalanced] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Reset coefficients when reaction changes
  useEffect(() => {
    setReactantCoeffs(selectedReaction.reactants.map(() => 0));
    setProductCoeffs(selectedReaction.products.map(() => 0));
    setIsBalanced(false);
    setShowSolution(false);
    setStartTime(Date.now());
  }, [selectedReaction]);

  // Check equation balance in real-time
  useEffect(() => {
    const rTotals: Record<string, number> = {};
    selectedReaction.reactants.forEach((mol, idx) => {
      const coeff = Number(reactantCoeffs[idx]) || 0;
      Object.entries(mol.atoms).forEach(([elem, count]) => {
        rTotals[elem] = (rTotals[elem] || 0) + Number(count) * coeff;
      });
    });

    const pTotals: Record<string, number> = {};
    selectedReaction.products.forEach((mol, idx) => {
      const coeff = Number(productCoeffs[idx]) || 0;
      Object.entries(mol.atoms).forEach(([elem, count]) => {
        pTotals[elem] = (pTotals[elem] || 0) + Number(count) * coeff;
      });
    });

    const allElems = Array.from(new Set([...Object.keys(rTotals), ...Object.keys(pTotals)]));
    
    // Balanced if all non-zero and equal
    const hasNonZero = Object.values(rTotals).some((val) => val > 0);
    const balanced =
      hasNonZero &&
      allElems.every((elem) => (rTotals[elem] || 0) === (pTotals[elem] || 0) && (rTotals[elem] || 0) > 0);

    if (balanced && !isBalanced) {
      setIsBalanced(true);
      // Trigger celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#38BDF8', '#F59E0B'],
      });

      if (onRecordSuccess) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        onRecordSuccess(selectedReaction, timeSpent);
      }
    } else if (!balanced && isBalanced) {
      setIsBalanced(false);
    }
  }, [reactantCoeffs, productCoeffs, selectedReaction, isBalanced, startTime, onRecordSuccess]);

  const handleReset = () => {
    setReactantCoeffs(selectedReaction.reactants.map(() => 0));
    setProductCoeffs(selectedReaction.products.map(() => 0));
    setShowSolution(false);
  };

  const handleApplySolution = () => {
    setReactantCoeffs([...selectedReaction.solutionCoefficients.reactants]);
    setProductCoeffs([...selectedReaction.solutionCoefficients.products]);
    setShowSolution(true);
  };

  return (
    <div className="space-y-6">
      {/* Reaction Selection Header & Metadata */}
      <div className="bg-[#08090C] rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-sky-950/80 text-sky-400 border border-sky-800/80">
              {selectedReaction.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
              {selectedReaction.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide">{selectedReaction.title}</h2>
          <p className="text-xs text-slate-400 max-w-2xl">{selectedReaction.description}</p>
        </div>

        {/* Reaction Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            id="reaction-selector"
            value={selectedReaction.id}
            onChange={(e) => {
              const r = PRESET_REACTIONS.find((item) => item.id === e.target.value);
              if (r) setSelectedReaction(r);
            }}
            className="bg-[#050608] text-slate-100 text-xs font-mono border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {PRESET_REACTIONS.map((rxn) => (
              <option key={rxn.id} value={rxn.id}>
                {rxn.title} ({rxn.difficulty})
              </option>
            ))}
          </select>

          <button
            id="ai-tutor-btn"
            onClick={() => onOpenAiTutor(selectedReaction, reactantCoeffs, productCoeffs)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-black rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{t.aiTutor}</span>
          </button>
        </div>
      </div>

      {/* Main Chemical Equation Bar & Real-time Balance Badge */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {t.curriculumBenchmark}: {selectedReaction.curriculumBenchmark}
            </span>
          </div>

          {/* Balanced Status Banner */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
              isBalanced
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            }`}
          >
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>{t.balanced} 🎉</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span>{t.unbalanced}</span>
              </>
            )}
          </div>
        </div>

        {/* Equation Formula Display with Live Coefficients */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-4 py-5 px-6 bg-[#050608] rounded-2xl border border-slate-800 font-mono">
          {/* Reactants */}
          {selectedReaction.reactants.map((mol, idx) => (
            <React.Fragment key={`rxn-mol-${idx}`}>
              {idx > 0 && <span className="text-xl font-black text-slate-600 mx-1">+</span>}
              <div className="flex items-center gap-2 bg-[#08090C] px-3.5 py-2 rounded-xl border border-slate-700 shadow-inner">
                <span className="text-xl font-black text-sky-400">{reactantCoeffs[idx] || 0}</span>
                <span className="text-lg font-extrabold text-slate-200">{mol.formula}</span>
              </div>
            </React.Fragment>
          ))}

          {/* Reaction Arrow */}
          <div className="flex items-center gap-1 mx-3 px-3.5 py-1.5 bg-sky-500/10 rounded-xl border border-sky-500/40 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </div>

          {/* Products */}
          {selectedReaction.products.map((mol, idx) => (
            <React.Fragment key={`prd-mol-${idx}`}>
              {idx > 0 && <span className="text-xl font-black text-slate-600 mx-1">+</span>}
              <div className="flex items-center gap-2 bg-[#08090C] px-3.5 py-2 rounded-xl border border-slate-700 shadow-inner">
                <span className="text-xl font-black text-sky-400">{productCoeffs[idx] || 0}</span>
                <span className="text-lg font-extrabold text-emerald-300">{mol.formula}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Interactive Molecule Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          {/* Reactants Box */}
          <div className="bg-[#050608] rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">{t.reactants}</span>
              <span className="text-xs text-slate-500 font-mono">Adjust coefficients</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedReaction.reactants.map((mol, idx) => (
                <Molecule2DView
                  key={`r-view-${idx}`}
                  molecule={mol}
                  coefficient={reactantCoeffs[idx] || 0}
                  onCoefficientChange={(val) => {
                    const newArr = [...reactantCoeffs];
                    newArr[idx] = val;
                    setReactantCoeffs(newArr);
                  }}
                  isReactant={true}
                />
              ))}
            </div>
          </div>

          {/* Products Box */}
          <div className="bg-[#050608] rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">{t.products}</span>
              <span className="text-xs text-slate-500 font-mono">Adjust coefficients</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedReaction.products.map((mol, idx) => (
                <Molecule2DView
                  key={`p-view-${idx}`}
                  molecule={mol}
                  coefficient={productCoeffs[idx] || 0}
                  onCoefficientChange={(val) => {
                    const newArr = [...productCoeffs];
                    newArr[idx] = val;
                    setProductCoeffs(newArr);
                  }}
                  isReactant={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              id="reset-coefficients-btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetCoefficients}</span>
            </button>

            <button
              id="show-solution-btn"
              onClick={handleApplySolution}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Show Solution</span>
            </button>
          </div>

          {showSolution && (
            <div className="text-xs font-mono text-amber-400 font-medium bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-800/40">
              Solution applied: Reactants [{selectedReaction.solutionCoefficients.reactants.join(', ')}] → Products [{selectedReaction.solutionCoefficients.products.join(', ')}]
            </div>
          )}
        </div>
      </div>

      {/* Visual Atom Scale & Mass Balance Component */}
      <AtomScaleVisualizer
        reactants={selectedReaction.reactants}
        products={selectedReaction.products}
        reactantCoefficients={reactantCoeffs}
        productCoefficients={productCoeffs}
      />
    </div>
  );
};
