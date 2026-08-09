import React, { useState } from 'react';
import { ChemicalReaction, UIStrings } from '../types';
import { PRESET_REACTIONS } from '../data/presetReactions';
import { EquationBalancer } from './EquationBalancer';
import { Award, Flame, Target, Trophy, Sparkles, Filter, CheckCircle } from 'lucide-react';

interface Props {
  t: UIStrings;
  onOpenAiTutor: (reaction: ChemicalReaction, currentReactants: number[], currentProducts: number[]) => void;
  xpPoints: number;
  streakDays: number;
  onAddXp: (amount: number) => void;
}

export const CurriculumPractice: React.FC<Props> = ({
  t,
  onOpenAiTutor,
  xpPoints,
  streakDays,
  onAddXp,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [completedReactionIds, setCompletedReactionIds] = useState<string[]>([]);

  const filteredReactions = PRESET_REACTIONS.filter((r) => {
    if (selectedDifficulty === 'All') return true;
    return r.difficulty === selectedDifficulty;
  });

  const handleRecordSuccess = (reaction: ChemicalReaction, timeSpentSec: number) => {
    if (!completedReactionIds.includes(reaction.id)) {
      setCompletedReactionIds([...completedReactionIds, reaction.id]);
      const earnedXp = reaction.difficulty === 'AP Chem' ? 100 : reaction.difficulty === 'Advanced' ? 75 : 50;
      onAddXp(earnedXp);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gamification Stats Banner */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100 tracking-wide">Curriculum Practice & Benchmark Mastery</h2>
          </div>
          <p className="text-xs text-slate-400">
            Solve randomized benchmark equations aligned to NGSS and AP Chemistry standards to earn XP and level up!
          </p>
        </div>

        {/* Badges and XP Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-800/80 px-4 py-2 rounded-xl text-amber-300 font-mono font-bold text-xs shadow">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center gap-2 bg-sky-950/60 border border-sky-800/80 px-4 py-2 rounded-xl text-sky-300 font-mono font-bold text-xs shadow">
            <Award className="w-4 h-4 text-sky-400" />
            <span>{xpPoints} XP</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Curriculum Difficulty */}
      <div className="flex items-center gap-2 bg-[#08090C] p-2 rounded-2xl border border-slate-800 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-500 ml-2" />
        <span className="text-xs font-mono font-semibold text-slate-500 mr-2">Level:</span>
        {['All', 'Beginner', 'Intermediate', 'Advanced', 'AP Chem'].map((diff) => (
          <button
            key={diff}
            id={`filter-diff-${diff}`}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition whitespace-nowrap ${
              selectedDifficulty === diff
                ? 'bg-sky-500 text-black shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredReactions.map((rxn) => {
          const isDone = completedReactionIds.includes(rxn.id);

          return (
            <div
              key={rxn.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-[#08090C] border-slate-800 hover:border-sky-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#050608] text-slate-400 border border-slate-800">
                    {rxn.difficulty}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-100 text-sm mb-1">{rxn.title}</h4>
                <div className="font-mono text-xs text-sky-400 font-semibold mb-2">{rxn.description}</div>
                <p className="text-[11px] text-slate-500 italic mb-3">{rxn.curriculumBenchmark}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400">
                  +{rxn.difficulty === 'AP Chem' ? 100 : rxn.difficulty === 'Advanced' ? 75 : 50} XP
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Reactants: {rxn.reactants.length} | Products: {rxn.products.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Equation Balancer Mode for Practice */}
      <EquationBalancer
        t={t}
        onOpenAiTutor={onOpenAiTutor}
        onRecordSuccess={handleRecordSuccess}
      />
    </div>
  );
};
