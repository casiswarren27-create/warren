import React, { useState } from 'react';
import { ChemicalReaction } from '../types';
import { Sparkles, X, Send, Bot, RefreshCw, Check, Lightbulb } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reaction: ChemicalReaction | null;
  currentReactants: number[];
  currentProducts: number[];
}

export const AITutorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reaction,
  currentReactants,
  currentProducts,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !reaction) return null;

  const handleAskAi = async (customPrompt?: string) => {
    setLoading(true);
    setError(null);

    const promptText = customPrompt || question || 'Explain step-by-step how to balance this equation.';

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equation: `${reaction.reactants.map((r) => r.formula).join(' + ')} -> ${reaction.products.map((p) => p.formula).join(' + ')}`,
          currentCoefficients: { reactants: currentReactants, products: currentProducts },
          question: promptText,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
      } else if (data.fallbackHint) {
        setExplanation(data.fallbackHint);
      } else {
        setExplanation('Count the number of each type of atom on both sides of the equation. Make sure reactants equal products for mass conservation!');
      }
    } catch (err: any) {
      console.error('Error contacting AI Tutor:', err);
      setError('Could not reach AI Tutor right now. Tip: Start by counting atoms present in only one molecule on each side!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050608]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#08090C] border border-sky-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#050608] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-800/80 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Gemini AI Chemistry Tutor</h3>
              <p className="text-[11px] text-sky-400 font-mono">
                {reaction.title} ({reaction.reactants.map((r) => r.formula).join(' + ')} → {reaction.products.map((p) => p.formula).join(' + ')})
              </p>
            </div>
          </div>

          <button
            id="close-ai-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#08090C] hover:bg-slate-800 text-slate-400 border border-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            <button
              id="prompt-step-by-step"
              onClick={() => handleAskAi('Give me a step-by-step balancing guide for this specific equation.')}
              className="px-3 py-1.5 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/80 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Step-by-Step Guide</span>
            </button>

            <button
              id="prompt-conservation-law"
              onClick={() => handleAskAi('Explain how Law of Conservation of Mass applies to this reaction.')}
              className="px-3 py-1.5 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/80 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Conservation of Mass</span>
            </button>
          </div>

          {/* AI Response Display */}
          {loading ? (
            <div className="p-6 text-center space-y-2 bg-[#050608] rounded-xl border border-slate-800">
              <RefreshCw className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
              <p className="text-xs text-sky-300 font-mono">Gemini AI is analyzing atomic counts and balancing rules...</p>
            </div>
          ) : explanation ? (
            <div className="p-4 bg-[#050608] border border-sky-800/50 rounded-xl text-xs text-slate-200 leading-relaxed space-y-2 font-mono whitespace-pre-wrap">
              <div className="font-bold text-sky-400 text-xs mb-2 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-sky-400" />
                <span>AI Tutor Explanation:</span>
              </div>
              {explanation}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-[#050608] rounded-xl border border-dashed border-slate-800 font-mono">
              Ask any question about balancing this equation or click one of the quick prompts above for instant AI tutoring!
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs font-mono rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#050608] border-t border-slate-800 flex items-center gap-2">
          <input
            id="ai-tutor-question-input"
            type="text"
            placeholder="Ask AI tutor (e.g. Why do I need a 2 coefficient for H2O?)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            className="flex-1 bg-[#08090C] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500"
          />

          <button
            id="send-ai-question-btn"
            onClick={() => handleAskAi()}
            disabled={loading}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
